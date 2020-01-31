import * as React from 'react'
import { InlineField } from './inline-field'
import { InlineTextFieldProps } from './inline-field-text'
import { InlineBlockContext } from './inline-field-blocks'

export interface BlockFieldProps {
  name: string
  children: any
}

export function BlockField({ name, children }: BlockFieldProps) {
  const block = React.useContext(InlineBlockContext)
  const fieldName = `${block.name}.${name}`
  return <InlineField name={fieldName}>{children}</InlineField>
}

/**
 * InlineTextField
 */
export interface BlockText {
  name: string
}
export function BlockText({ name }: InlineTextFieldProps) {
  return (
    <BlockField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return <input type="text" {...input} />
        }
        return <>{input.value}</>
      }}
    </BlockField>
  )
}
