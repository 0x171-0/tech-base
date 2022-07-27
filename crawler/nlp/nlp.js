"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NLP = void 0;
const natural_1 = __importDefault(require("natural"));
const pluralize_1 = __importDefault(require("pluralize"));
const sentiment_1 = __importDefault(require("sentiment"));
const compromise_1 = __importDefault(require("compromise"));
const DicModel_1 = require("../db/models/DicModel");
class NLP {
    constructor() {
        this.positivePoint = 0;
        this.negativePoint = 0;
        this.stopWordsSet = new Set(['CNN', 'Business', 'Reuters']);
        this.analyzeContent = (content) => __awaiter(this, void 0, void 0, function* () {
            const tokenizedWords = yield this._tokenizeWords(content);
            const wordsArr = [];
            let followingNthIndex = 1;
            for (let currentIndex = 0; currentIndex < tokenizedWords.length; currentIndex += followingNthIndex) {
                followingNthIndex = 1;
                const currentWord = tokenizedWords[currentIndex];
                const nextWord = tokenizedWords[currentIndex + 1];
                if (!currentWord)
                    continue;
                if (!this._isValidWord(currentWord) &&
                    currentWord.toLowerCase() !== 'the')
                    continue;
                if (this._isProperNoun(currentWord, nextWord)) {
                    do {
                        followingNthIndex++;
                    } while ((this._isValidWord(tokenizedWords[currentIndex + followingNthIndex]) &&
                        this._isFirstLetterUpperCase(tokenizedWords[currentIndex + followingNthIndex])) ||
                        (tokenizedWords[currentIndex + followingNthIndex] &&
                            tokenizedWords[currentIndex + followingNthIndex].toLowerCase() ===
                                'of'));
                    wordsArr.push(this._combineWordsToProperNoun(tokenizedWords, currentIndex, followingNthIndex));
                }
                else if (this._isValidWord(currentWord.toLowerCase())) {
                    if (this.stemWords[currentWord]) {
                        wordsArr.push(this.stemWords[currentWord]);
                    }
                    else {
                        currentWord[currentWord.length - 1] == 's'
                            ? wordsArr.push(pluralize_1.default.singular(currentWord))
                            : wordsArr.push(currentWord);
                    }
                }
            }
            const wordsCount = {};
            wordsArr.forEach(function (word) {
                wordsCount[word] = (wordsCount[word] || 0) + 1;
            });
            const topWordsArr = yield this._sortTopWordsOfNews(wordsCount, 49);
            const { terms, behaviors } = yield this._extractVerbsAndNouns(topWordsArr);
            const formattedTopTag = [];
            topWordsArr.forEach(function (tagInfo) {
                formattedTopTag.push({
                    tags: String(tagInfo[0]),
                    count: Number(tagInfo[1]),
                });
            });
            return {
                terms,
                behaviors,
                tags: formattedTopTag,
            };
        });
        this._extractVerbsAndNouns = (topWordsArr) => __awaiter(this, void 0, void 0, function* () {
            return yield this.analyzeVerbsAndNouns(topWordsArr);
        });
        this._sortTopWordsOfNews = (wordsAndCounts, topNth) => __awaiter(this, void 0, void 0, function* () {
            return Object.keys(wordsAndCounts)
                .map((wordAsKey) => [wordAsKey, Number(wordsAndCounts[wordAsKey])])
                .sort(function (word, otherWord) {
                return Number(otherWord[1]) - Number(word[1]);
            })
                .slice(0, topNth);
        });
        this._isFirstLetterUpperCase = (str) => {
            if (!str)
                return false;
            const firstLetter = str.charAt(0);
            return (firstLetter === firstLetter.toUpperCase() &&
                /[(a-z)(A-Z)]/gm.test(firstLetter));
        };
        this._isValidWord = (word) => {
            const result = word &&
                word.length > 1 &&
                /[(a-z)(A-Z)(0-9)]/gm.test(word.charAt(0)) && // validate first letter of the word
                !this._isStopWords(word);
            return result;
        };
        this._isStopWords = (word) => {
            return this.stopWords.hasOwnProperty(word) || this.stopWordsSet.has(word);
        };
        this._isProperNoun = (currentWord, nextWord) => {
            return (this._isFirstLetterUpperCase(currentWord) &&
                nextWord &&
                this._isFirstLetterUpperCase(nextWord));
        };
        this._combineWordsToProperNoun = (words, currentWordIndex, followingNthWordfromCurrent) => {
            let properNoun = '';
            for (let index = currentWordIndex; index < currentWordIndex + followingNthWordfromCurrent; index++) {
                properNoun == ''
                    ? (properNoun = words[index])
                    : (properNoun = properNoun + ' ' + words[index]);
            }
            return properNoun;
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stemWords = yield this.findDic('STEM');
            this.stopWords = yield this.findDic('STOPWORDS');
        });
    }
    _tokenizeWords(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenizer = new natural_1.default.RegexpTokenizer({
                pattern: /[^(A-Z)(a-z)(0-9)(_/)/%/&/$/#/£/-]/,
            });
            return yield tokenizer.tokenize(content);
        });
    }
    /**
     * Analyze sentimental(positive, negative and portion) of the news
     * @param newsContent
     */
    analyzeSentiment(newsContent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.stemWords || !this.stopWords) {
                yield this.init();
            }
            const sentiment = new sentiment_1.default();
            const { score, comparative, positive, negative, calculation: comparativeOrigin, } = yield sentiment.analyze(newsContent);
            yield comparativeOrigin.forEach((e) => {
                Object.values(e)[0] > 0
                    ? (this.positivePoint += Object.values(e)[0])
                    : (this.negativePoint += Object.values(e)[0]);
            });
            const result = {
                score,
                comparative,
                positive: yield this._formatAndFilterOutStopWords(positive),
                negative: yield this._formatAndFilterOutStopWords(negative),
                calculation: [this.positivePoint, this.negativePoint],
            };
            return result;
        });
    }
    /**
     * Analyze the terms(nouns) & verbs
     * @param wordsArr
     */
    analyzeVerbsAndNouns(wordsArr) {
        return __awaiter(this, void 0, void 0, function* () {
            const compromiseDoc = compromise_1.default(wordsArr);
            const behaviorsArr = yield compromiseDoc
                .verbs()
                .toInfinitive()
                .out('array');
            const termsArr = yield compromiseDoc
                .nouns()
                .toSingular()
                .out('array');
            return {
                terms: this._formatAndFilterOutStopWords(termsArr),
                behaviors: this._formatAndFilterOutStopWords(behaviorsArr),
            };
        });
    }
    _formatAndFilterOutStopWords(wordsArr) {
        const wordCount = {};
        const resultArr = [];
        wordsArr.forEach((wordAsKey) => {
            if (this._isStopWords(wordAsKey))
                return;
            wordCount[wordAsKey] = (wordCount[wordAsKey] || 0) + 1;
        });
        Object.entries(wordCount).forEach((e) => {
            resultArr.push({
                word: e[0],
                size: Number(e[1]),
            });
        });
        return resultArr;
    }
    /**
     * Add the words that have no meaning and should be filtered out when analyzing a news to custom dictionary
     * @param stopWordArr
     */
    addStopWords(stopWordArr) {
        return __awaiter(this, void 0, void 0, function* () {
            const _formatWords = (stopWordArr) => __awaiter(this, void 0, void 0, function* () {
                let wordsMapToZeroObj = {}; // ex: { words : 0 }
                return stopWordArr.forEach((wordAsKey) => (wordsMapToZeroObj[wordAsKey] = 0));
            });
            DicModel_1.DicModel.updateOne({ USAGE: 'STOPWORDS' }, _formatWords(stopWordArr), { multi: true }, function (err, docs) {
                if (err)
                    console.log(err);
                console.log('Stop words inserted successfully：' + docs);
            });
        });
    }
    /**
     * Groups together different inflected forms of a word
     * For Example, 'Musk' should be map into 'Elon Musk'
     * And when analyzing news 'Musk' should be count into 'Elon Musk'
     * @param wordsArr ex: addStem([['Musk', 'Elon Musk'], ['Trump', 'Donald Trump']]);
     */
    addStem(wordsArr) {
        return __awaiter(this, void 0, void 0, function* () {
            const _formatWords = (wordsArr) => __awaiter(this, void 0, void 0, function* () {
                let mappingWordToOrigin = {};
                yield wordsArr.forEach((e) => {
                    const variant = e[0];
                    const rootWord = e[1];
                    return (mappingWordToOrigin[variant] = rootWord);
                });
            });
            DicModel_1.DicModel.updateOne({ USAGE: 'STEM' }, _formatWords(wordsArr), { multi: true }, function (err, docs) {
                if (err)
                    console.log(err);
                console.log('Stem words inserted successfully：' + docs);
            });
        });
    }
    findDic(usage) {
        return __awaiter(this, void 0, void 0, function* () {
            const ans = yield DicModel_1.DicModel.find({ USAGE: usage }).exec();
            return ans[0].toObject();
        });
    }
}
exports.NLP = NLP;
