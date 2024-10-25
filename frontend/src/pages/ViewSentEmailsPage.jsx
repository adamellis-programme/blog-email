import EmailItem from '../components/EmailItem'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import {
  getEmailListAdmin,
  getEmailsSentAdmin,
  setEmailData,
  setEmailSentlData,
} from '../features/admin/adminSlice'
import BackButton from '../components/BackButton'
import NotAuthorized from '../components/NotAuthorized'
import MobileBackBTN from '../components/MobileBackBTN'
import SearchBar from '../components/search components/SearchBar'
import GlobalPageLoader from '../components/loaders/GlobalPageLoader'
import AdminEmailModal from '../components/email/AdminEmailModal'
import { setShowEmailModal } from '../features/admin/adminSlice'
import EmailSentItem from '../components/EmailSentItem'

const ViewSentEmailsPage = () => {
  const { errMSG, isRejected, emailData, showEmailModal, sentEmailData } = useSelector(
    (state) => state.admin
  )
  // console.log(errMSG)

  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: 0,
    })
    return () => {}
  }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        // setEmailSentlData
        const data = await dispatch(getEmailsSentAdmin()).unwrap()
        dispatch(setEmailSentlData(data))
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])
  console.log(sentEmailData)
  // message sent back from the server
  if (errMSG !== null) {
    return <NotAuthorized errMSG={errMSG} />
  }

  const displayEmailHeader = () => {
    if (emailData && emailData.length === 0) {
      return `no emails to show`
    }
    if (emailData && emailData.length === 1) {
      return `${emailData && emailData.length} email`
    }
    if (emailData && emailData.length > 1) {
      return `${emailData && emailData.length} emails`
    }
  }

  if (!sentEmailData) {
    return <GlobalPageLoader />
  }
  return (
    <>
      {showEmailModal && <AdminEmailModal />}
      <div className="page-container email-page-container">
        <div className="view-emails-back-btn-wrap">
          <BackButton />
        </div>
        <div className="view-emails-mobile-back-btn-wrap">
          <MobileBackBTN />
        </div>

        <section className="email-signup-header">
          <h1>
            view and manage all your email signups
            <p>in one place</p>
          </h1>
          <p>{displayEmailHeader()}</p>
        </section>

        <section className="serach-emails-section">
          <SearchBar data={emailData && emailData} />
        </section>

        <section className="email-signup-list-section">
          <div className="email-list-header">
            <div className="email-item-inner-div">item</div>
            <div className="email-item-inner-div">to</div>
            <div className="email-item-inner-div">from</div>
            <div className="email-item-inner-div">subject</div>
            <div className="email-item-inner-div">read</div>
          </div>

          {sentEmailData &&
            sentEmailData.length > 0 &&
            sentEmailData.map((item, index) => (
              <EmailSentItem key={item._id} data={item} index={index} />
            ))}
        </section>
      </div>
    </>
  )
}

export default ViewSentEmailsPage
