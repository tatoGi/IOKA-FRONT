export const sectionTypes = {
  home: 1,
  text: 2,
  news: 3,
  event: 4,
  course: 5,
  school: 6,
  programs: 7,
  photo_video_gallery: 8,
  team: 9,
  request_information: 10,
  faq: 11,
  publication: 12,
  contact: 13
}

export const staticPageData = {
  "search": {
    "en": {
      slugs: [{
        slug: "en/search",
        locale: "en", 
      } 
    ], 
    sluggable: {title: 'Search'}
    },
    "ka": {
      slugs: [ 
      {
        slug: "ka/dzebna",
        locale: "ka",
      }, 
    ], 
    sluggable: {title: 'ძებნა'}
    },
    "ru": {
      slugs: [ 
      {
        slug: "ru/poisk",
        locale: "ru",
      },
    ], 
    sluggable: {title: 'поиск'}
    } 
  },
   "results": {
    "en": {
      slugs: [
        {
          slug: "en/results",
          locale: "en"
        }
      ],
      sluggable: {title: 'Results'}
    },
    "ka": {
      slugs: [
        {
          slug: "ka/shedegebi",
          locale: "ka"
        }
      ],
      sluggable: {title: 'შედეგები'}
    },
    "ru": {
      slugs: [
        {
          slug: "ru/rezultat",
          locale: "ru"
        }
      ],
      sluggable: {title: 'результат'}
    }
   }, 
  "see-all": {
    "en": {
      slugs: [{
        slug: "en/see-all",
        locale: "en",
      } 
    ], 
    sluggable: {title: "See-All"}
    },
    "ka": {
      slugs: [{
        slug: "ka/naxe-kvela",
        locale: "ka",
      } 
    ], 
    sluggable: {title: "ნახე-ყველა"}
    },
    "ru": {
      slugs: [{
        slug: "ru/uvidet-vse",
        locale: "ru",
      } 
    ], 
    sluggable: {title: "увидеть-всё"}
    },
  },

}


export const staticPages = {
  "en/search": "search",
  "ka/dzebna": "search",
  "ru/poisk": "search",
  "en/results": "results",
  "ka/shedegebi": "results",
  "ru/rezultat": "results",
  "en/see-all": "see-all",
  "ka/naxe-kvela": "see-all",
  "ru/uvidet-vse": "see-all" 
}