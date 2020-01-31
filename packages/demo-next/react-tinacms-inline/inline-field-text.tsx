import * as React from 'react'
import { InlineField } from './inline-field'

/**
 * InlineTextField
 */
export interface InlineTextFieldProps {
  name: string
}

export function InlineTextField({ name }: InlineTextFieldProps) {
  return (
    <InlineField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return <input type="text" {...input} />
        }
        return <>{input.value}</>
      }}
    </InlineField>
  )
}
