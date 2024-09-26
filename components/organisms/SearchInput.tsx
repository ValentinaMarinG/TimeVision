import React from 'react'
import { View } from 'react-native'
import * as Tokens from "../tokens"
import { Search } from '../atoms/Icon'
import  { SearchField } from '../molecules/Search'
import { Link } from 'expo-router'

export const SearchInput = () => {
  return (
        <SearchField/>
  )
}