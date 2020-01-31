import * as React from 'react'
import styled from 'styled-components'
import {
  ModalActions,
  ModalHeader,
  ModalBody,
  Modal,
  ModalPopup,
  BlockTemplate,
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

  const template = blocks.cta.template
  const removeBlock = () => remove(index)
  const moveBlockUp = () => move(index, index - 1)
  const moveBlockDown = () => move(index, index + 1)

  if (status === 'inactive') {
    return children
  }

  return (
    <BlockWrapper>
      <AddBlockMenu
        addBlock={block => insert(index + 1, block)}
        templates={Object.entries(blocks).map(([, block]) => block.template)}
      />
      <button onClick={removeBlock}>Remove</button>
      <button onClick={moveBlockUp} disabled={isFirst}>
        Up
      </button>
      <button onClick={moveBlockDown} disabled={isLast}>
        Down
      </button>
      <BlockSettings template={template} />

      {children}
    </BlockWrapper>
  )
}

const BlockWrapper = styled.div`
  border: '1px solid green';
  maxwidth: '500px';
  margin: '16px';
`

interface AddBlockMenu {
  addBlock(data: any): void
  templates: BlockTemplate[]
}

function AddBlockMenu({ templates, addBlock }: AddBlockMenu) {
  return (
    <>
      {templates.map(template => {
        return (
          <button
            onClick={() => {
              addBlock({
                _template: template.type,
                ...template.defaultItem,
              })
            }}
          >
            Add {template.label}
          </button>
        )
      })}
    </>
  )
}

function BlockSettings({ template }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(p => !p)}>Settings</button>
      {open && (
        <BlockSettingsModal template={template} close={() => setOpen(false)} />
      )}
    </>
  )
}

function BlockSettingsModal({ template, close }: any) {
  const { form } = React.useContext(InlineFormContext)
  const { name: blockName } = React.useContext(InlineBlockContext)

  const fields = template.fields.map((field: any) => ({
    ...field,
    name: `${blockName}.${field.name}`,
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
