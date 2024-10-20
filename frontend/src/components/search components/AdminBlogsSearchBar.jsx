import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminBlogs, setAdminBlogs } from '../../features/blog/blogSlice'

function AdminBlogsSearchBar() {
  const dispatch = useDispatch()
  const dropDown = useRef(null)

  const [searchType, setSearchType] = useState('title') // Default search type

  const handleTextSearchType = (e) => {
    const searchOptions = dropDown.current
    const selectedOption = searchOptions.selectedOptions[0]
    setSearchType(selectedOption.value)
  }

  const handleTextSearch = async (e) => {
    const allBlogs = await dispatch(getAdminBlogs()).unwrap()
    // console.log(allBlogs)
    let { value: textInput, id } = e.target
    textInput = textInput.toLowerCase()

    if (textInput) {
      const filtered = allBlogs.filter((blog) => {
        let { blogTitle, author, category } = blog
        author = author.toLowerCase()
        blogTitle = blogTitle.toLowerCase()
        category = category.toLowerCase()

        // TRY THIS WITH A REDUCER
        // if author iterates and returns to handleTetSearch
        // all blog items that author.includes the text input
        // because the way react renders we could not use
        // the re-asign of let
        // EACH LOOP RETURNS  ---- > author.includes(textInput)
        // The filter function itself handles building the filtered list based on the return values
        switch (searchType) {
          // if serchType is authour... return author
          case 'author':
            return author.includes(textInput)
          case 'title':
            // return everything that includes textInput
            return blogTitle.includes(textInput)
          case 'country':
            return category.includes(textInput)
          default:
            return false // No match for othetr search types
        }
      })

      // finaly dispatch filtered
      dispatch(setAdminBlogs(filtered))
    }
  }

  return (
    <div className="admin-blog-search-wrap">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="admin-blog-search-input"
          placeholder={`Search by blog ${searchType}`}
          onChange={handleTextSearch}
        />

        {/* <label for="cars">Choose a car:</label> */}
        {/* prettier-ignore */}
        <div className="select-position-wrap">
        <select ref={dropDown} onChange={handleTextSearchType} className="blog-select" name="search-type" id="search-type">
          {/* <option className="blog-option" id="author" value="search-select">
            Search Types
          </option> */}
          <option className="blog-option" id="title" value="title">
            Title
          </option>
          <option className="blog-option" id="author" value="author">
            Author
          </option>
          <option className="blog-option" id="country" value="country">
            Country
          </option>
        </select>
        <span className='select-chevron-wrap'> 
        <i className="select-chevron  fa-solid fa-chevron-down"></i>
        </span>
        </div>
      </form>

      <form>{/* Other radio buttons and logic... */}</form>
    </div>
  )
}

export default AdminBlogsSearchBar
