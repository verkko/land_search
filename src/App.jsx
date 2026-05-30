import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function App() {

  const [lands,setLands] = useState([])
  const [transactions,setTransactions] = useState([])
  const [showModal,setShowModal] = useState(false)

  const [surveySearch,setSurveySearch] = useState("")
  const [khataSearch,setKhataSearch] = useState("")

  useEffect(()=>{
    loadLands()
  },[])

  async function loadLands(){

    const { data } = await supabase
      .from('SearchEC2')
      .select('*')
      .order('id',{ascending:true})

    setLands(data || [])
  }

  async function showTransactions(row){

    if(
      !row.trans_table_record_IDs ||
      row.trans_table_record_IDs.length===0
    ){
      setTransactions([])
      setShowModal(true)
      return
    }

    const { data } = await supabase
      .from('TransDetails')
      .select('*')
      .in('id',row.trans_table_record_IDs)
      .order('id',{ascending:true})

    setTransactions(data || [])
    setShowModal(true)
  }

  async function toggleFav(row){

    await supabase
      .from('SearchEC2')
      .update({
        isFav:!row.isFav
      })
      .eq('id',row.id)

    loadLands()
  }

  function getStatus(row){

    if(row.TransDetails)
      return "success"

    if(row.isGovt)
      return "govt"

    if(row.isNoTrans)
      return "notrans"

    if(
      row.status &&
      !row.TransDetails &&
      !row.isGovt &&
      !row.isNoTrans
    )
      return "error"

    return "pending"
  }

  const filteredLands = lands.filter(row => {

    const surveyMatch =
      row.SurveyNo?.toLowerCase()
      .includes(surveySearch.toLowerCase())

    const khataMatch =
      row.KhataNo?.toLowerCase()
      .includes(khataSearch.toLowerCase())

    return surveyMatch && khataMatch
  })

  const govt =
    lands.filter(x=>x.isGovt).length

  const noTrans =
    lands.filter(x=>x.isNoTrans).length

  const trans =
    lands.filter(x=>x.TransDetails).length

  const fav =
    lands.filter(x=>x.isFav).length

  const errors =
    lands.filter(
      x =>
      x.status &&
      !x.TransDetails &&
      !x.isGovt &&
      !x.isNoTrans
    ).length

  return(

    <div className="container">

      <h1>Land Dashboard</h1>

      <div className="cards">

        <div className="card">
          <h3>{lands.length}</h3>
          Total Lands
        </div>

        <div className="card govt-card">
          <h3>{govt}</h3>
          Govt Lands
        </div>

        <div className="card no-card">
          <h3>{noTrans}</h3>
          No Transactions
        </div>

        <div className="card trans-card">
          <h3>{trans}</h3>
          Transactions
        </div>

        <div className="card fav-card">
          <h3>{fav}</h3>
          Favorites
        </div>

        <div className="card error-card">
          <h3>{errors}</h3>
          Errors
        </div>

      </div>

      <div className="search-bar">

        <input
          placeholder="Search Survey No"
          value={surveySearch}
          onChange={(e)=>setSurveySearch(e.target.value)}
        />

        <input
          placeholder="Search Khata No"
          value={khataSearch}
          onChange={(e)=>setKhataSearch(e.target.value)}
        />

      </div>

      <table>

        <thead>
          <tr>
            <th>Fav</th>
            <th>ID</th>
            <th>Survey No</th>
            <th>Khata No</th>
            <th>Status</th>
            <th>Transactions</th>
          </tr>
        </thead>

        <tbody>

          {filteredLands.map(row=>{

            const status = getStatus(row)

            return(

            <tr
              key={row.id}
              className={
                status==="error"
                ? "error-row"
                : ""
              }
            >

              <td>

                <button
                  className="fav-btn"
                  onClick={()=>toggleFav(row)}
                >
                  {row.isFav ? '⭐':'☆'}
                </button>

              </td>

              <td>{row.id}</td>

              <td>{row.SurveyNo}</td>

              <td>{row.KhataNo}</td>

              <td>

                <span className={`badge ${status}`}>

                  {status==="success" && "Transactions Found"}

                  {status==="govt" && "Govt Land"}

                  {status==="notrans" && "No Transactions"}

                  {status==="error" && "Error"}

                  {status==="pending" && "Pending"}

                </span>

              </td>

              <td>

                {
                  row.trans_table_record_IDs?.length > 0 ?

                  <button
                    className="trans-btn"
                    onClick={() =>
                      showTransactions(row)
                    }
                  >
                    {row.trans_table_record_IDs.length}
                  </button>

                  :

                  "-"
                }

              </td>

            </tr>

            )
          })}

        </tbody>

      </table>

      {
        showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Transaction History</h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Close
              </button>

            </div>

            <table>

              <thead>

                <tr>
                  <th>S No</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Nature</th>
                  <th>Doc No</th>
                </tr>

              </thead>

              <tbody>

                {transactions.map(t=>(
                  <tr key={t.id}>

                    <td>{t["S No"]}</td>
                    <td>{t.TransDate}</td>
                    <td>{t.Description}</td>
                    <td>{t.nature_of_deed}</td>
                    <td>{t.doc_no}</td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  )
}