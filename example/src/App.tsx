import React, { useEffect } from 'react'
import ToastManager, { Toast } from 'react-native-toastify-plus'

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      Toast.success("teste message")
    }, 1000);
  })

  return (
    <>
      <ToastManager />
    </>
  )
}

export default App
