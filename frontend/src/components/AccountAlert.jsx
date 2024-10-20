import React from 'react'

function AccountAlert({ alertMSG, alertType }) {
  function getClassName(params) {
    switch (alertType) {
      case 'success':
        return 'account-success'
        break
      case 'error':
        return 'account-error'
        break
      default:
        return 'account-error'
        break
    }
  }
  console.log(alertType)
  return (
    <div className={`account-alert-div ${getClassName()} `}>
      <h4>{alertMSG}</h4>
    </div>
  )
}

export default AccountAlert
