import React from 'react'
import { StyleSheet, View, type DimensionValue } from 'react-native'

const Spacer = ({ width = '100%' as DimensionValue, height = 16 }: { height?: number, width?: DimensionValue }) => {
  return (
    <View style={[styles.spacer, { width, height }]}/>
  )
}

export default Spacer

const styles = StyleSheet.create({
  spacer: {
    height: 16,
  },
})