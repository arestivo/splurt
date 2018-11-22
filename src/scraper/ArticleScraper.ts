import { Scraper } from './Scraper'

export abstract class ArticleScraper extends Scraper {
  protected static isValidTitle(title : string, tree : any) : boolean {
    if (!title) return false

    if (tree.lexeme.value)
      return title.toLowerCase().includes(tree.lexeme.value.toLowerCase().replace(/\'/g, ''))

    if (tree.lexeme.type === 'and')
      return this.isValidTitle(title, tree.left) && this.isValidTitle(title, tree.right)

    if (tree.lexeme.type === 'or')
      return this.isValidTitle(title, tree.left) || this.isValidTitle(title, tree.right)

    return true
  }

  protected static normalizeType(type : string) {
    return type
  }
}
