import * as React from 'react'
import {
  ModalActions,
  ModalHeader,
  ModalBody,
  Modal,
  ModalPopup,
} from 'tinacms'
import { FieldsBuilder } from '@tinacms/form-builder'
import { Button } from '../../@tinacms/styles/build/index.js'
import {
  InlineFormContext,
  InlineBlocksContext,
  InlineBlockContext,
} from '../react-tinacms-inline'

/**
 *
 * TODO: I think this should be defined in `tinacms` and not with the rest of the inline stuff?
 */
export function BlocksControls({ children, index }) {
  const { status } = React.useContext(InlineFormContext)
  const { insert, move, remove, blocks, count } = React.useContext(
    InlineBlocksContext
  )
  const isFirst = index === 0
  const isLast = index === count - 1

  const [open, setOpen] = React.useState(false)

  if (status === 'inactive') {
    return children
  }
  return (
    <div
      style={{ border: '1px solid green', maxWidth: '500px', margin: '16px' }}
    >
      {Object.entries(blocks)
        .map(([, block]) => block.template)
        .map(template => {
          return (
            <button
              onClick={() => {
                console.log(template)
                insert(index + 1, {
                  _template: template.type,
                  ...template.defaultItem,
                })
              }}
            >
              Add {template.label}
            </button>
          )
        })}
      <button onClick={() => remove(index)}>Remove</button>
      <button onClick={() => move(index, index - 1)} disabled={isFirst}>
        Up
      </button>
      <button onClick={() => move(index, index + 1)} disabled={isLast}>
        Down
      </button>
      <button onClick={() => setOpen(p => !p)}>Settings</button>
      {open && (
        <BlockSettings
          template={blocks.cta.template}
          close={() => setOpen(false)}
        />
      )}
      {children}
    </div>
  )
}

function BlockSettings({ template, close }: any) {
  const { form } = React.useContext(InlineFormContext)
  const { name } = React.useContext(InlineBlockContext)

  const fields = template.fields.map((subField: any) => ({
    ...subField,
    name: `${name}.${subField.name}`,
  }))

  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={close}>Settings</ModalHeader>
        <ModalBody>
          <FieldsBuilder form={form} fields={fields} />
        </ModalBody>
        <ModalActions>
          <Button onClick={close}>Cancel</Button>
        </ModalActions>
      </ModalPopup>
    </Modal>
  )
}
