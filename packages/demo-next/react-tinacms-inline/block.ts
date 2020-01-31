import { BlockTemplate } from 'tinacms'

/**
 * Blocks consist of a `template` and a `Component`
 */
export interface Block {
  Component: any
  template: BlockTemplate
}
