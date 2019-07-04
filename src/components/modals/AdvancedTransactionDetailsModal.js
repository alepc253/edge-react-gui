// @flow

import { PrimaryButton, SecondaryButton } from 'edge-components'
import { type EdgeTransaction } from 'edge-core-js'
import React, { Component } from 'react'
import { Alert, Clipboard, Linking, TouchableOpacity } from 'react-native'

import { MATERIAL_COMMUNITY, TELESCOPE } from '../../constants/indexConstants.js'
import { scale } from '../../lib/scaling.js'
import s from '../../locales/strings.js'
import Text from '../../modules/UI/components/FormattedText/index'
import { Icon } from '../../modules/UI/components/Icon/Icon.ui.js'
import { InteractiveModal } from '../../modules/UI/components/Modals/InteractiveModal/InteractiveModal.ui.js'
import styles, { activeOpacity } from '../../styles/scenes/TransactionDetailsStyle.js'

export type AdvancedTransactionDetailsModalOwnProps = {
  ...EdgeTransaction,
  txExplorerUrl: string | null,
  onDone: () => void
}

export class AdvancedTransactionDetailsModal extends Component<AdvancedTransactionDetailsModalOwnProps> {
  handleClick = () => {
    if (this.props.txExplorerUrl) {
      Linking.canOpenURL(this.props.txExplorerUrl).then(supported => {
        if (supported) {
          Linking.openURL(this.props.txExplorerUrl)
        }
      })
    }
  }

  copyTxIdToClipboard = () => {
    const { txid, onDone } = this.props
    Clipboard.setString(txid)
    Alert.alert(s.strings.transaction_details_copy_txid_title, s.strings.transaction_details_copy_txid_message, [
      { text: s.strings.string_ok, onPress: onDone }
    ])
  }

  copyRawHexToClipboard = () => {
    const { signedTx, onDone } = this.props
    Clipboard.setString(signedTx)
    Alert.alert(s.strings.transaction_details_copy_txid_title, s.strings.transaction_details_copy_raw_hex_message, [
      { text: s.strings.string_ok, onPress: onDone }
    ])
  }

  render () {
    return (
      <InteractiveModal>
        <InteractiveModal.Icon>
          <Icon style={styles.txIDIcon} name={TELESCOPE} type={MATERIAL_COMMUNITY} size={scale(34)} />
        </InteractiveModal.Icon>

        <InteractiveModal.Title>
          <Text>{s.strings.transaction_details_tx_id_modal_title}</Text>
        </InteractiveModal.Title>

        <InteractiveModal.Body>
          <InteractiveModal.Description style={{ textAlign: 'center' }}>
            <Text>{this.props.txid}</Text>
          </InteractiveModal.Description>
        </InteractiveModal.Body>

        <InteractiveModal.Footer>
          <InteractiveModal.Row>
            <InteractiveModal.Item>
              <TouchableOpacity onPress={this.handleClick} style={styles.blockExplorerButton} activeOpacity={activeOpacity}>
                <Text style={styles.blockExplorerButtonText}>{s.strings.transaction_details_show_advanced_block_explorer}</Text>
              </TouchableOpacity>
            </InteractiveModal.Item>
          </InteractiveModal.Row>
          <InteractiveModal.Row>
            <InteractiveModal.Item>
              <PrimaryButton onPress={this.copyTxIdToClipboard} style={{ flex: -1 }}>
                <PrimaryButton.Text>{s.strings.transaction_details_copy_tx_id}</PrimaryButton.Text>
              </PrimaryButton>
            </InteractiveModal.Item>
          </InteractiveModal.Row>
          <InteractiveModal.Row>
            <InteractiveModal.Item>
              <SecondaryButton onPress={this.copyRawHexToClipboard} style={{ flex: -1 }}>
                <SecondaryButton.Text>{s.strings.transaction_details_copy_signed_tx}</SecondaryButton.Text>
              </SecondaryButton>
            </InteractiveModal.Item>
          </InteractiveModal.Row>
        </InteractiveModal.Footer>
      </InteractiveModal>
    )
  }
}

export type AdvancedTransactionDetailsOpts = {
  txid: string,
  txExplorerUrl: string | null
}

export const createAdvancedTransactionDetailsModal = (opts: AdvancedTransactionDetailsOpts) => {
  function AdvancedTransactionDetailsWrapped (props: { +onDone: Function }) {
    return <AdvancedTransactionDetailsModal {...opts} {...props} />
  }
  return AdvancedTransactionDetailsWrapped
}
