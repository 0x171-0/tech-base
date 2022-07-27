import natural from 'natural'
import pluralize from 'pluralize'
import Sentiment from 'sentiment'
import compromise from 'compromise'
import { DicModel } from '../db/models/DicModel'

export class NLP {
	positivePoint: number = 0
	negativePoint: number = 0
	stopWordsSet = new Set(['CNN', 'Business', 'Reuters'])
	stemWords: any
	stopWords: any

	constructor() {}

	async init() {
		this.stemWords = await this.findDic('STEM')
		this.stopWords = await this.findDic('STOPWORDS')
	}

	analyzeContent = async (content: string) => {
		const tokenizedWords: string[] = await this._tokenizeWords(content)

		const wordsArr = []
		let followingNthIndex = 1

		for (
			let currentIndex = 0;
			currentIndex < tokenizedWords.length;
			currentIndex += followingNthIndex
		) {
			followingNthIndex = 1
			const currentWord = tokenizedWords[currentIndex]
			const nextWord = tokenizedWords[currentIndex + 1]
			if (!currentWord) continue
			if (
				!this._isValidWord(currentWord) &&
				currentWord.toLowerCase() !== 'the'
			)
				continue

			if (this._isProperNoun(currentWord, nextWord)) {
				do {
					followingNthIndex++
				} while (
					(this._isValidWord(
						tokenizedWords[currentIndex + followingNthIndex],
					) &&
						this._isFirstLetterUpperCase(
							tokenizedWords[currentIndex + followingNthIndex],
						)) ||
					(tokenizedWords[currentIndex + followingNthIndex] &&
						tokenizedWords[currentIndex + followingNthIndex].toLowerCase() ===
							'of')
				)

				wordsArr.push(
					this._combineWordsToProperNoun(
						tokenizedWords,
						currentIndex,
						followingNthIndex,
					),
				)
			} else if (this._isValidWord(currentWord.toLowerCase())) {
				if (this.stemWords[currentWord]) {
					wordsArr.push(this.stemWords[currentWord])
				} else {
					currentWord[currentWord.length - 1] == 's'
						? wordsArr.push(pluralize.singular(currentWord))
						: wordsArr.push(currentWord)
				}
			}
		}

		const wordsCount: any = {}
		wordsArr.forEach(function (word: string) {
			wordsCount[word] = (wordsCount[word] || 0) + 1
		})

		const topWordsArr = await this._sortTopWordsOfNews(wordsCount, 49)
		const { terms, behaviors } = await this._extractVerbsAndNouns(topWordsArr)

		const formattedTopTag: { tags: string; count: number }[] = []
		topWordsArr.forEach(function (tagInfo) {
			formattedTopTag.push({
				tags: String(tagInfo[0]),
				count: Number(tagInfo[1]),
			})
		})

		return {
			terms,
			behaviors,
			tags: formattedTopTag,
		}
	}

	_extractVerbsAndNouns = async (topWordsArr: (string | number)[][]) => {
		return await this.analyzeVerbsAndNouns(topWordsArr)
	}

	_sortTopWordsOfNews = async (wordsAndCounts: object, topNth: number) => {
		return Object.keys(wordsAndCounts)
			.map((wordAsKey) => [wordAsKey, Number(wordsAndCounts[wordAsKey])])
			.sort(function (word, otherWord) {
				return Number(otherWord[1]) - Number(word[1])
			})
			.slice(0, topNth)
	}
	_isFirstLetterUpperCase = (str: string) => {
		if (!str) return false
		const firstLetter = str.charAt(0)
		return (
			firstLetter === firstLetter.toUpperCase() &&
			/[(a-z)(A-Z)]/gm.test(firstLetter)
		)
	}

	_isValidWord = (word: string) => {
		const result =
			word &&
			word.length > 1 &&
			/[(a-z)(A-Z)(0-9)]/gm.test(word.charAt(0)) && // validate first letter of the word
			!this._isStopWords(word)
		return result
	}

	_isStopWords = (word: string) => {
		return this.stopWords.hasOwnProperty(word) || this.stopWordsSet.has(word)
	}

	_isProperNoun = (currentWord: string, nextWord: string) => {
		return (
			this._isFirstLetterUpperCase(currentWord) &&
			nextWord &&
			this._isFirstLetterUpperCase(nextWord)
		)
	}

	_combineWordsToProperNoun = (
		words: string[],
		currentWordIndex: number,
		followingNthWordfromCurrent: number,
	) => {
		let properNoun = ''
		for (
			let index = currentWordIndex;
			index < currentWordIndex + followingNthWordfromCurrent;
			index++
		) {
			properNoun == ''
				? (properNoun = words[index])
				: (properNoun = properNoun + ' ' + words[index])
		}
		return properNoun
	}

	async _tokenizeWords(content: string) {
		const tokenizer = new natural.RegexpTokenizer({
			pattern: /[^(A-Z)(a-z)(0-9)(_/)/%/&/$/#/£/-]/,
		})
		return await tokenizer.tokenize(content)
	}

	/**
	 * Analyze sentimental(positive, negative and portion) of the news
	 * @param newsContent
	 */
	async analyzeSentiment(newsContent: string) {
		if (!this.stemWords || !this.stopWords) {
			await this.init()
		}

		const sentiment = new Sentiment()
		const {
			score,
			comparative,
			positive,
			negative,
			calculation: comparativeOrigin,
		} = await sentiment.analyze(newsContent)

		await comparativeOrigin.forEach((e) => {
			Object.values(e)[0] > 0
				? (this.positivePoint += Object.values(e)[0])
				: (this.negativePoint += Object.values(e)[0])
		})

		const result: {
			score: number
			comparative: number
			calculation: number[]
			positive: object[]
			negative: object[]
		} = {
			score,
			comparative,
			positive: await this._formatAndFilterOutStopWords(positive),
			negative: await this._formatAndFilterOutStopWords(negative),
			calculation: [this.positivePoint, this.negativePoint],
		}

		return result
	}

	/**
	 * Analyze the terms(nouns) & verbs
	 * @param wordsArr
	 */
	async analyzeVerbsAndNouns(wordsArr: (string | number)[][]) {
		const compromiseDoc: compromise.DefaultDocument = compromise(wordsArr)

		const behaviorsArr: string[] = await compromiseDoc
			.verbs()
			.toInfinitive()
			.out('array')

		const termsArr: string[] = await compromiseDoc
			.nouns()
			.toSingular()
			.out('array')

		return {
			terms: this._formatAndFilterOutStopWords(termsArr),
			behaviors: this._formatAndFilterOutStopWords(behaviorsArr),
		}
	}

	_formatAndFilterOutStopWords(
		wordsArr: string[],
	): { word: string; size: number }[] {
		const wordCount: any = {}
		const resultArr: { word: string; size: number }[] = []
		wordsArr.forEach((wordAsKey) => {
			if (this._isStopWords(wordAsKey)) return
			wordCount[wordAsKey] = (wordCount[wordAsKey] || 0) + 1
		})
		Object.entries(wordCount).forEach((e) => {
			resultArr.push({
				word: e[0],
				size: Number(e[1]),
				// TODO: "size" should be decrypted with "count" to "times" and, save to DB. If frontEnd need to transfer it to size can do it in API.
			})
		})

		return resultArr
	}

	/**
	 * Add the words that have no meaning and should be filtered out when analyzing a news to custom dictionary
	 * @param stopWordArr
	 */
	async addStopWords(stopWordArr: string[]) {
		const _formatWords = async (stopWordArr: string[]) => {
			let wordsMapToZeroObj: any = {} // ex: { words : 0 }
			return stopWordArr.forEach(
				(wordAsKey: string) => (wordsMapToZeroObj[wordAsKey] = 0),
			)
		}

		DicModel.updateOne(
			{ USAGE: 'STOPWORDS' },
			_formatWords(stopWordArr),
			{ multi: true },
			function (err, docs) {
				if (err) console.log(err)
				console.log('Stop words inserted successfully：' + docs)
			},
		)
	}

	/**
	 * Groups together different inflected forms of a word
	 * For Example, 'Musk' should be map into 'Elon Musk'
	 * And when analyzing news 'Musk' should be count into 'Elon Musk'
	 * @param wordsArr ex: addStem([['Musk', 'Elon Musk'], ['Trump', 'Donald Trump']]);
	 */
	async addStem(wordsArr: string[][]) {
		const _formatWords = async (wordsArr: string[][]) => {
			let mappingWordToOrigin: any = {}
			await wordsArr.forEach((e) => {
				const variant = e[0]
				const rootWord = e[1]
				return (mappingWordToOrigin[variant] = rootWord)
			})
		}
		DicModel.updateOne(
			{ USAGE: 'STEM' },
			_formatWords(wordsArr),
			{ multi: true },
			function (err, docs) {
				if (err) console.log(err)
				console.log('Stem words inserted successfully：' + docs)
			},
		)
	}

	async findDic(usage: string) {
		const ans = await DicModel.find({ USAGE: usage }).exec()
		return ans[0].toObject()
	}
}
