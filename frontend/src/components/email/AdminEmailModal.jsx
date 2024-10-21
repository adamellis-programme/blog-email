import { useDispatch, useSelector } from 'react-redux'
import { sendEmail, setShowEmailModal } from '../../features/admin/adminSlice'
import { useEffect, useState } from 'react'
import { getUserForEmailAdmin, getUserAdmin } from '../../features/admin/adminSlice'
import { getCurrentUSer } from '../../features/users/userSlice'

const AdminEmailModal = () => {
  const { adminEmailUserID } = useSelector((state) => state.admin)
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [fromEmail, setFromEmail] = useState('') // new state for "from" value
  const [toValue, setToValue] = useState('') // new state for "from" value
  const [bodyValue, setBodyValue] = useState('') // new state for "from" value

  useEffect(() => {
    const getData = async () => {
      try {
        const emailData = await dispatch(
          getUserForEmailAdmin({ id: adminEmailUserID })
        ).unwrap()
        setToValue(`TO: ${emailData?.email}` || '')

        const adminUser = await dispatch(getCurrentUSer()).unwrap()
        console.log(adminUser)
        console.log(adminUser)
        setUser(emailData)
        setAdminUser(adminUser)
        setFromEmail(`FROM: ${adminUser?.email || ''}`) // set the from field when data is loaded
      } catch (error) {
        console.log(error)
      }
    }

    getData()
    return () => {}
  }, [adminEmailUserID])

  const dispatch = useDispatch()

  const handleCloseModal = () => {
    dispatch(setShowEmailModal(false))
  }

  const handleSendEmail = () => {
    console.log('sending email...')
    console.log(bodyValue)

    const data = {
      from: fromEmail,
      to: toValue,
      text: bodyValue,
    }
    dispatch(sendEmail(data))
  }

  console.log(user)
  return (
    <div className="admin-email-modal-wrap">
      <div className="admin-email-modal">
        <div className="admin-email-header">
          <h1>send email</h1>
          <i className="fa-regular fa-paper-plane send-icon"></i>
        </div>
        <div className="admin-email-body">
          <div className="admin-email-formm-group">
            <input
              type="text"
              className="admin-email-input admin-email-to"
              placeholder="to"
              value={toValue}
              onChange={(e) => setToValue(e.target.value)}
              disabled
            />
          </div>
          <div className="admin-email-formm-group">
            <input
              type="text"
              className="admin-email-input admin-email-from"
              placeholder="from"
              value={fromEmail} // use value instead of defaultValue
              onChange={(e) => setFromEmail(e.target.value)} // control the input
              disabled
            />
          </div>
          <div className="admin-email-formm-group">
            <textarea
              onChange={(e) => setBodyValue(e.target.value)}
              name=""
              id=""
              className="admin-email-input admin-email-text "
              placeholder="email body"
            ></textarea>
          </div>
          <div className="admin-email-btn-wrap">
            <button onClick={handleSendEmail} className="admin-email-btn">
              send
            </button>
            <button onClick={handleCloseModal} className="admin-email-btn">
              cancel
            </button>
          </div>
        </div>
        <div className="admin-email-footer">
          <p>all emails are logged in our server</p>
        </div>
      </div>
    </div>
  )
}

export default AdminEmailModal
