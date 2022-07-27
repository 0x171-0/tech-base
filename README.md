# TechBase

###### Tech Trend Of News Tracking Website

###### Website URL: https://techbase.white-100.online/

###### Please use Chrome to open the website.


| Test Account    | Test Passwords | 
| --------        | -------- | 
| test@gmail.com     | 123     | 


## Table of Contents

- [Main Features](#Main-Features)
- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Data Pipeline](#Data-Pipeline)
- [Demonstration](#Demonstration)
  - [Home page](#Home-page)
  - [News Timeline page](#News-Timeline-page)
  - [News Analysis Page](#News-Analysis-Page)
  - [Profile page](#Profile-page)
  - [Public page](#Public-page)
- [Database Schema](#Database-Schema)
- [Contact](#Contact)

## Main Features

- News analysis
  - Utilizing NLP to analyze sentiment and words component of news.
- Trends words statistics
  - Track trends on specific topics
  - shows the most popular themes and keywords recently
- Customized management system
  - With bookmarks, Posts, folders manage the system for users to share and save their comments and thoughts.
- Categorize news
  - Displays the trends on keywords of news
- Recommend and search function
  - Auto analyze each news and recommend user-related topics
  - User can search for news by tags or title filtering by time
- Tags and title searching function, empower the user to find the related topics efficiently
- Logs system

## Technologies

### Backend

- Node.js / Express.js
- RESTful API
- NGINX
- TypeScript / JavaScript

### Front-End

- HTML
- CSS
- JavaScript
- AJAX

### Cloud Service (AWS)

- Compute: EC2
- Storage: S3 (images)
- Database: Mongo Atlas
- Network: CloudFront, ELB

### Database

- Mongo (Data / Logs)
- Redis (Cache)

### Tools

- Version Control: Git, GitHub
- CI / CD: Jenkins
- Test: Jest, Artillery
- Agile: Trello (Scrum)

### Logs System

- Different Levels, translates to data about data.
- Custom formatting with good readability
- Several Transports (console, local file, mongo)

### Others

- Design Pattern: MVC
- NLP: **Sentiment**, **compromise**, **natural**, **pluralize**
- Web Crawler: cheerio

## Architecture

![Architecture.png](https://i.imgur.com/4LwtQfv.jpg)


- Redirects 443 port requests by **NGINX** after receiving the request from clients
- Scraped news content through **Web Crawler**
- Use MongoDB Database as Database
- Built Cache Mechanism by **_Redis_**
- Integrate GitHub Repository With Jenkins (CI/CD)
- Built comments and Emojics feedback system to the news and sections of an article
- Used MongoDB as the database
- Used MongoDB Atlas as storage space
- Designed non-relational non relational data schema and model structures for the database.
- Constructed RESTful APIs
- Performed unit test and integration test by Mocha and Chai
- Automated data pipeline for news segmentation, analyzing, and tagging keywords to the tech news
- Built login / logout / register authentication functions

- Dictionary for NLP
- User data

## Data Pipeline

- Utilize Regular expression for Content Segmentation
  - Crawl data form well-known media through Web Crawler
- NLP Analysis
  - Get top keywords by NLP and Sentiment Analysis
  - Segmented and analized news content by **Sentiment**, **compromise**, **natural**, **pluralize**, customized javascript function, and verified news with news' intention by **Sentiment**
    - Get Content - Tokenization - Input Content : Civil rights and activist groups blasted Facebook's leadership on Tuesday after meeting with CEO Mark Zuckerberg and other executives to discuss the demands of a large advertiser boycott that now includes hundreds of brands. "The meeting we just left was a disappointment," said Rashad Robinson, the president of Color of Change. "[Facebook] showed up to the meeting expecting an 'A' for attendance."
    - Output Content :
      [
      Civil, rights, and, activist,
      groups, blasted, Facebook, s,
      leadership, on, Tuesday, after,
      meeting, with, CEO, Mark,
      Zuckerberg, and, other, executives,
      to, discuss, the, demands,
      of, a, large, advertiser,
      boycott, that, now, includes,
      hundreds, of, brands, The,
      meeting, we, just, left,
      was, a, disappointment, said,
      Rashad, Robinson, the, president,
      of, Color, of, Change,
      Facebook, showed, up, to,
      the, meeting, expecting, an,
      A, for, attendance
      ] - Sentiment & Emotion Calculation - Take the results of Tokenization and Analyze - terms - positive - negative - behaviors - Keywords Tags - Stemming / Lemmatization - Affects, Affected, Affection => Affect - Name Entity Recognition - Elon Musk, Musk => Elon Musk - Donald Trump, Trump => Trump

## Demonstration

### Home page

- Shows keywords by popularity
- Click the tag and search the popular keywords

![homePage.gif](https://i.imgur.com/FE3oosy.gif)

### News Timeline page

- Displays the trends over Time on various topics
- Built a search and recommend system that can provide users with more convenient and efficient ways to get related news about a theme or keywords. (Search by the or tag)
- Built time filter function

![tileLinePage.gif](https://i.imgur.com/2yVSIXe.gif)

### News Analysis Page

- Utilized the Single Page Application and infinite scroll feature technique to optimize the user experience
- Show the information of news, including contents, analysis, related news, comments.
  ![analysis.gif](https://i.imgur.com/8jxgQAl.gif)

- Comment and Emojics feedback system
  ![comment.gif](https://i.imgur.com/zxdiSZT.gif)

- Established bookmarks, posts, folders, browsing histories, and watch later functions
  ![](https://i.imgur.com/HpLQ6Q8.gif)

### Profile page

- Built data management system for user
- Established bookmarks, posts, folders, browsing histories, and watch later functions
- Utilized the Single Page Application and infinite scroll feature technique to optimize the user experience
  ![](https://i.imgur.com/zdNc29l.gif)

### Public page

- Built follows function, and allowed users to follow post of each other

## Database Schema

#### News data Sturcture

```
 {
  _id : ObjectId, // Primary Key
  publisher: String,
  date: Date,
  title: // Text Index //Unique
  {
    type: String,
    unique: true,
    index: true,
  },
  href: // Unique
  {
    type: String,
    unique: true,
  },
  img: String,
  tags: [ // SubDocument
  {
    _id: ObjectId,   // Primary Key
    tags: String,
    count: Number,
  },{
    _id: ObjectId,   // Primary Key
    tags: String,
    count: Number,
  },{
    _id: ObjectId,   // Primary Key
    tags: String,
    count: Number,
  }, ...
  ],
  content: [ // SubDocument
  {
    content: String,
    emoji: [{{
    _id: String,   // Primary Key
    date: Date,
    emoji: Number,
    count: Number,
    user_id: String,
    user_name: String,
  },{
    _id: String,   // Primary Key
    date: Date,
    emoji: Number,
    count: Number,
    user_id: String,
    user_name: String,
  },...
  }],
  comment: [ // SubDocument
  {
     _id: ObjectId,   // Primary Key
    content_id: String,
    date: Date,
    emoji: String,
    comment: String,
    title: String,
  },
  {
     _id: ObjectId,   // Primary Key
    content_id: String,
    date: Date,
    emoji: String,
    comment: String,
    title: String,
  },...
  ],
  score: Number,
  comparative: Number,
  calculation: Array,
  positive: [ // SubDocument
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  }...
  ],
  negative: [ // SubDocument
  {
     _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
     _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  }...],
  portion: Number,
  terms: [ // SubDocument
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  }...],
  behaviors: [ // SubDocument
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    word: String,
    size: Number,
  }...],
  category: [ // SubDocument
  {
    _id: ObjectId,   // Primary Key
    label: String,
    value: Number,
  },
  {
    _id: ObjectId,   // Primary Key
    label: String,
    value: Number,
  } ,
  {
    _id: ObjectId,   // Primary Key
    label: String,
    value: Number,
  }...],
}
```

#### User data Sturcture

```
 {
  _id: ObjectId,  // Primary Key
  name: String,
  email: String,  // Unique
  password: String,
  picture: String,
  intro: String,

  follow: [  // SubDocument
  {
    _id: String,   // Primary Key
    name: String,
  },
  {
    _id: String,   // Primary Key
    name: String,
  },
  {
    _id: String,   // Primary Key
    name: String,
  },...],
  notice: [  // SubDocument
    {
      _id: ObjectId,   // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },
    {
      _id: ObjectId,   // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },...
  ],
  followers: [  // SubDocument
  {
    _id: String,   // Primary Key
    name: String,
  },
  {
    _id: String,   // Primary Key
    name: String,
  },
  {
    _id: String,   // Primary Key
    name: String,
  }...],
  access_token: String,
  access_expired: Number,
  login_at: Date,
  history:  [  // SubDocument
    {
      _id: String,   // Primary Key
      brose_date: Date,
      date: Date,
      publisher: String,
      title: String,
      href: String,
      content: String,
      tags: Array,
    },{
      _id: String,   // Primary Key
      brose_date: Date,
      date: Date,
      publisher: String,
      title: String,
      href: String,
      content: String,
      tags: Array,
    },
  ],
  bookmarks: // SubDocument
    {
      _id: ObjectId,    // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },
    {
      _id: ObjectId,   // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },...
  ],
  books_folder: Array,
  posts: [  // SubDocument
    {
      _id: ObjectId,  // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },
    {
      _id: ObjectId,   // Primary Key
      news_id: String,
      folder: String,
      publisher: String,
      date: Date,
      title: String,
      href: String,
      img: String,
      content: String,
      tags: Array,
      comment_date: Date,
      comment_title: String,
      comment: String,
      },...
  ],
  posts_folder: Array,
  watch_later: [  // SubDocument
    {
      _id: String,   // Primary Key
      brose_date: Date,
      date: Date,
      publisher: String,
      title: String,
      href: String,
      content: String,
      tags: Array,
    },{
      _id: String,   // Primary Key
      brose_date: Date,
      date: Date,
      publisher: String,
      title: String,
      href: String,
      content: String,
      tags: Array,
    },...
  ],
  comment: [  // SubDocument
    {
      _id: ObjectId,   // Primary Key
      content_id: String,
      date: Date,
      emoji: String,
      comment: String,
      title: String,
    },{
      _id: ObjectId,   // Primary Key
      content_id: String,
      date: Date,
      emoji: String,
      comment: String,
      title: String,
    },...
   ],
}
```

#### Dictionary data Sturcture

- Stem words dictionary

```json
{
    "_id":   // Primary Key
    {
        "$oid":"5f02b324bcf49e0af65fe862"
    },
    "USAGE":"STEM",
    "Bryant":"Kobe Bryant",
    "Musk":"Elon Musk",
    "Trump":"Donald Trump"
    ...
}
```

- Stop words dictionary

```json
{
    "_id":   // Primary Key
        {
        "$oid":"5f02d54dbcf49e0af65fe865"
        },
    "USAGE":"STOPWORDS",
    "a":0,
    "able":0,
    "about":0,
    "above":0,
    "according":0,
    "across":0,
    "actually":0,
    "after":0,
    "afterwards":0,
    ...
}
```

## Contact

Email: t100210022002@gmail.com
