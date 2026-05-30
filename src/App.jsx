import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function App() {

  const [lands,setLands] = useState([])
  const [transactions,setTransactions] = useState([])
  const [selected,setSelected] = useState(null)

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

    setSelected(row)

    if(
      !row.trans_table_record_IDs ||
      row.trans_table_record_IDs.length===0
    ){
      setTransactions([])
      return
    }

    const { data } = await supabase
      .from('TransDetails')
      .select('*')
      .in('id',row.trans_table_record_IDs)
      .order('id',{ascending:true})

    setTransactions(data || [])
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

  const govt =
    lands.filter(x=>x.isGovt).length

  const noTrans =
    lands.filter(x=>x.isNoTrans).length

  const trans =
    lands.filter(x=>x.TransDetails).length

  const fav =
    lands.filter(x=>x.isFav).length

  return(
    <div className="container">

      <h1>Land Dashboard</h1>

      <div className="cards">

        <div className="card">
          Total<br/>
          {lands.length}
        </div>

        <div className="card">
          Govt<br/>
          {govt}
        </div>

        <div className="card">
          No Transactions<br/>
          {noTrans}
        </div>

        <div className="card">
          Transactions<br/>
          {trans}
        </div>

        <div className="card">
          Favorites<br/>
          {fav}
        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>Fav</th>
            <th>Survey No</th>
            <th>Khata No</th>
            <th>Category</th>
            <th>Transactions</th>
          </tr>
        </thead>

        <tbody>

          {lands.map(row=>(
            <tr
              key={row.id}
              onClick={()=>showTransactions(row)}
            >

              <td>
                <button
                  onClick={(e)=>{
                    e.stopPropagation()
                    toggleFav(row)
                  }}
                >
                  {row.isFav ? '⭐':'☆'}
                </button>
              </td>

              <td>{row.SurveyNo}</td>
              <td>{row.KhataNo}</td>

              <td>

                {row.isGovt
                  ? 'Govt Land'
                  : row.isNoTrans
                  ? 'No Transactions'
                  : 'Transactions Found'}

              </td>

              <td>
                {row.trans_table_record_IDs?.length || 0}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {selected && (

        <div>

          <h2>

            Survey No :
            {selected.SurveyNo}

          </h2>

          <h3>
            Transaction History
          </h3>

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

      )}

    </div>
  )
}