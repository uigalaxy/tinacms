import * as React from 'react'
import { Block } from './block'
import { InlineField } from './inline-field'

/**
 * Blocks
 */

export interface InlineBlocksProps {
  name: string
  blocks: {
    [key: string]: Block
  }
}

export interface InlineBlocksActions {
  count: number
  insert(index: number, data: any): void
  move(froom: number, to: number): void
  remove(index: number): void
  blocks: {
    [key: string]: Block
  }
}

export const InlineBlocksContext = React.createContext<InlineBlocksActions>(
  null
)

export function InlineBlocks({ name, blocks }: InlineBlocksProps) {
  return (
    <InlineField name={name}>
      {({ input, form }) => {
        const allData = input.value || []

        const move = (from: number, to: number) => {
          form.mutators.move(name, from, to)
        }

        const remove = (index: number) => {
          form.mutators.remove(name, index)
        }

        const insert = (index: number, block: any) => {
          form.mutators.insert(name, index, block)
        }

        return (
          <InlineBlocksContext.Provider
            value={{ insert, move, remove, blocks, count: allData.length }}
          >
            {allData.map((data, index) => {
              const Block = blocks[data._template]

              if (!Block) {
                console.warn('Unrecognized Block of type:', data._template)
                return null
              }

              const blockName = `${input.name}.${index}`

              return (
                <InlineBlock
                  index={index}
                  name={blockName}
                  data={data}
                  block={Block}
                />
              )
            })}
          </InlineBlocksContext.Provider>
        )
      }}
    </InlineField>
  )
}

/**
 * InlineBlock
 */
export interface InlineBlockProps {
  index: number
  name: string
  data: any
  block: Block
}
export function InlineBlock({ name, data, block, index }: InlineBlockProps) {
  return (
    <InlineBlockContext.Provider value={{ name }}>
      <block.Component data={data} index={index} />
    </InlineBlockContext.Provider>
  )
}

export const InlineBlockContext = React.createContext<any>(null)
