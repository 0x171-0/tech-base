import {NewsModel} from '../models/NewsModel';

/**
 * The NewsModule db service
 * @class
 */
export class NewsModule {
  /**
   * @param {string} title
   */
  searchByTitle = async (title: string) => {
    return (
      await NewsModel.find(
          {
            title: title,
          },
          {},
      )
    )[0];
  }
  /**
  * @abstract
  * @param {string} href
  * @return {NewsModel}
  */
  searchByHref = async (href: string) => {
    return (
      await NewsModel.find(
          {
            href: href,
          },
          {},
      )
    )[0];
  }
}
