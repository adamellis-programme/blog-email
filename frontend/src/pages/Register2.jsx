import { useState } from 'react'
import MiddelCollumnAdvert from '../components/advert components/MiddelCollumnAdvert'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register } from '../features/auth/authSlice'
import { formatedDOB, getDate } from '../utils'
import { emailSignUp } from '../features/users/userSlice'
function Register() {
  const eyeOff = 'fa-solid fa-eye'
  const eyeOn = 'fa-solid fa-eye-slash'

  const [passwordType1, setPasswordType1] = useState('password') // For password field 1
  const [passwordType2, setPasswordType2] = useState('password') // For password field 2

  const [passwordClass1, setPasswordClass1] = useState(eyeOff) // For password field 1 icon
  const [passwordClass2, setPasswordClass2] = useState(eyeOff) // For password field 2 icon

  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  // const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    dob: '',
    terms: false,
    emailList: false,

    day: '',
    month: '',
    year: '',
  })
  const { name, email, password, password2, day, year, month, terms, emailList } =
    formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  )
  // dd mm year
  const onChange = (e) => {
    const { type, value, name, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : e.target.value,
    }))

    // if (['day', 'month', 'name'].includes(name)) {
      // use  if (isNaN(parsedValue)) {}
    //   console.log('object')
    // }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    // if (password !== password2) {
    //   toast.error('passwords do not match')
    // } else  {
    const userData = {
      name,
      email,
      password,
      password2,
      dob: formatedDOB(day, month, year),
      terms,
      emailList,
      // sent for error handeling
      day,
      month,
      year,
    }

    console.log(userData)

    dispatch(register(userData))
      .unwrap()
      .then((user) => {
        console.log(user)
        toast.success(`Registered new user: ${user.name}`)
        navigate('/')
      })
      .catch((err) => {
        setShowError(true)
        setErrorMsg(err)

        setTimeout(() => {
          setShowError(false)
          setErrorMsg('')
        }, 2500)
      })

    if (emailList === true) {
      const emailData = {
        date: getDate().date,
        time: getDate().time,
        name: `${name}`,
        email,
        terms,
      }

      dispatch(emailSignUp({ data: emailData, from: 'regPage' }))

      console.log(emailData)
    }

    // }
  }

  const handleShowPassword = (index) => {
    // HAS to be seperate state for the two inputs
    // Pass the field index (1 or 2)
    // place the logic INSIDE the ()
    if (index === 1) {
      setPasswordType1(passwordType1 === 'password' ? 'text' : 'password')
      setPasswordClass1(passwordType1 === 'password' ? eyeOn : eyeOff)
    } else {
      setPasswordType2(passwordType2 === 'password' ? 'text' : 'password')
      setPasswordClass2(passwordType2 === 'password' ? eyeOn : eyeOff)
    }
  }

  return (
    <>
      <div className="register-page-container">
        <section className="register-heading">
          <h1 className="register-h1">
            <p>
              <i className="fa-solid fa-right-to-bracket register-arrow"></i> register
              here
            </p>
            <p>
              for your <span className="free-span">free</span> account
            </p>
          </h1>
        </section>

        <section className="register-form-section">
          {/* <div className="holding-box"></div> */}
          <div className="holding-box register-form-holding-box">
            <form onSubmit={onSubmit} className="register-form">
              <div className="form-group">
                {showError && <div className="alert-login">{errorMsg}</div>}
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={onChange}
                  className="form-input register-input"
                  name="name"
                  placeholder="Enter Name"
                  // required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={onChange}
                  className="form-input register-input"
                  name="email"
                  placeholder="Enter Email"
                  // required
                />
              </div>
              <div className="form-group register-password-wrap">
                <input
                  type={passwordType1}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="form-input register-input"
                  name="password"
                  placeholder="Enter Password"
                  autoComplete="on"
                  // required
                />
                <i
                  onClick={() => handleShowPassword(1)}
                  className={`view-password ${passwordClass1}`}
                ></i>
              </div>
              <div className="form-group register-password-wrap">
                <input
                  type={passwordType2}
                  id="password2"
                  value={password2}
                  onChange={onChange}
                  className="form-input register-input"
                  name="password2"
                  placeholder="Confirm password"
                  autoComplete="on"
                  // required
                />
                <i
                  onClick={() => handleShowPassword(2)}
                  className={`view-password ${passwordClass2}`}
                ></i>
              </div>
              <div className="form-group register-dob-wrap">
                <div className="register-dob-container">
                  <label className="dob-label" htmlFor="">
                    date of birth
                  </label>
                  <input
                    onChange={onChange}
                    name="day"
                    type="text"
                    className="dob-input"
                    placeholder="dd"
                    value={day.slice(0, 2)}
                  />
                  <input
                    onChange={onChange}
                    name="month"
                    type="text"
                    className="dob-input"
                    placeholder="mm"
                    value={month.slice(0, 2)}
                  />
                  <input
                    onChange={onChange}
                    name="year"
                    type="text"
                    className="dob-input"
                    placeholder="yy yy"
                    value={year.slice(0, 4)}
                  />
                </div>
              </div>

              <div className="form-group register-dob-wrap">
                <label htmlFor="reg-terms-check" className="reg-check-label">
                  <input
                    onChange={onChange}
                    className="reg-terms-check"
                    type="checkbox"
                    name="terms"
                    checked={terms}
                    id="reg-terms-check"
                    value={terms}
                  />
                  <span className="reg-email-span">accept terms</span>
                </label>
                <label htmlFor="reg-email-check" className="reg-check-label">
                  <input
                    onChange={onChange}
                    className="reg-email-check"
                    type="checkbox"
                    name="emailList"
                    checked={emailList}
                    id="reg-email-check"
                    value={emailList}
                  />
                  <span className="reg-email-span">join our mailing list</span>
                </label>
              </div>
              <div className="form-group form-btn-container">
                <button className="form-btn register-btn">register me</button>
              </div>
            </form>
          </div>

          <div className="holding-box"></div>
        </section>
      </div>
    </>
  )
}

export default Register
