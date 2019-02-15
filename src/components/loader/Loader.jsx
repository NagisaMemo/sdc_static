import React from 'react';
import LoadingOverlay from 'react-loading-overlay'
import BarLoader from 'react-spinners/BarLoader'

export default function Loader({ active,children }) {
  return (
    <LoadingOverlay
      active={active}
      spinner={<BarLoader width={100} widthUnit="vw" color="skyblue" height={10} heightUnit="px"/>}
      text={children}
    >
    </LoadingOverlay>
  )
}