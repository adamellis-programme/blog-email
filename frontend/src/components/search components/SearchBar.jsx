import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setEmailDataFiltered,
  getEmailListAdmin,
  setEmailData,
} from '../../features/admin/adminSlice'
function SearchBar({ data }) {
  const dispatch = useDispatch()
  const dataName = ''

  // console.log(data)
  // const [formData, setFormData] = useState({
  //   searchTerm: '',
  // })

  // const { searchTerm } = formData

  // no id or value on the input needed as we not doing anything with the text in the input
  const handleSearch = async (e) => {
    const inputText = e.target.value.toLowerCase()
    console.log(inputText)

    const emailData = [...data]

    const newArr = []

    const freshData = await dispatch(getEmailListAdmin()).unwrap()
    console.log(freshData)
    freshData.forEach((item) => {
      const loopedEmail = item.email.toLowerCase()

      if (loopedEmail.indexOf(inputText) !== -1) {
        newArr.push(item)
      }

      // console.log(newArr)
      dispatch(setEmailData(newArr))
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit')
  }
  return (
    <form onSubmit={handleSubmit} className="search-comp-form">
      <input
        onChange={handleSearch}
        className="search-comp-input"
        type="text"
        placeholder="search-emails"
        id="searchTerm"
        // value={searchTerm}
      />
    </form>
  )
}

export default SearchBar
