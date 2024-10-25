import { useDispatch, useSelector } from 'react-redux'
import { sendEmail, setShowEmailModal } from '../../features/admin/adminSlice'
import { useEffect, useState } from 'react'
import { getUserForEmailAdmin, getUserAdmin } from '../../features/admin/adminSlice'
import { getCurrentUSer } from '../../features/users/userSlice'

const AdminEmailModal = () => {
  const { adminEmailUserID } = useSelector((state) => state.admin)
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [fromName, setFromName] = useState('') // new state for "from" value
  const [toValue, setToValue] = useState('') // new state for "to" value
  const [bodyValue, setBodyValue] = useState('') // new state for "body" value
  const [subject, setSubject] = useState('') // new state for "subject" value

  useEffect(() => {
    const getData = async () => {
      try {
        const emailData = await dispatch(
          getUserForEmailAdmin({ id: adminEmailUserID })
        ).unwrap()
        setToValue(`${emailData?.email}` || '')

        const adminUser = await dispatch(getCurrentUSer()).unwrap()
        setUser(emailData)
        setAdminUser(adminUser)
        setFromName(`${adminUser?.name || ''}`) // set the from field when data is loaded
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

  // Helper function to format the email body
  // const formatEmailBody = (body) => {
  //   // Replace all line breaks (\n) with <br> tags
  //   let formattedBody = body.replace(/\n/g, '<br>')
  //   // Wrap the entire text in a single <p> tag
  //   return `<p>${formattedBody}</p>`
  // }

  const formatEmailBody = (body) => {
    console.log('BODY: ', body)

    // Step 1: Replace all line breaks (\n) with <br> tags
    let formattedBody = body.replace(/\n/g, '<br>')

    // Step 2: Wrap text between <br> tags in <p> tags
    // Split the body by <br> tags, wrap the non-empty segments in <p> tags, and then join them back
    formattedBody = formattedBody
      .split(/<br>/) // Split by <br> tag
      .map((textSegment) => textSegment.trim()) // Trim any leading/trailing spaces
      // map text seg
      .map((textSegment) => (textSegment ? `<p>${textSegment}</p>` : '<br>')) // Wrap non-empty text in <p>, keep <br>
      .join('') // Join everything back together without extra separators

    console.log('FORMATTED BODY: ', formattedBody)

    return formattedBody
  }

  const handleSendEmail = () => {
    console.log('sending email...')

    // Format the body value for email
    const formattedBody = formatEmailBody(bodyValue)

    console.log(formattedBody)

    // return
    console.log(JSON.stringify(formattedBody))

    const data = {
      from: fromName,
      to: toValue,
      text: formattedBody,
      subject,
    }

    dispatch(sendEmail(data))
  }

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
              value={`TO: ${toValue}`}
              onChange={(e) => setToValue(e.target.value)}
              disabled
            />
          </div>
          <div className="admin-email-formm-group">
            <input
              type="text"
              className="admin-email-input admin-email-from"
              placeholder="from"
              value={`FROM: ${fromName}`} // use value instead of defaultValue
              onChange={(e) => setFromName(e.target.value)} // control the input
              disabled
            />
          </div>
          <div className="admin-email-formm-group">
            <input
              type="text"
              className="admin-email-input admin-email-from"
              placeholder="subject"
              value={subject} // use value instead of defaultValue
              onChange={(e) => setSubject(e.target.value)} // control the input
            />
          </div>
          <div className="admin-email-formm-group">
            <textarea
              onChange={(e) => setBodyValue(e.target.value)}
              value={bodyValue}
              className="admin-email-input admin-email-text"
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
