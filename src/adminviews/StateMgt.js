import React,{useState} from "react";
import axios from "axios";
import "../index.css";

function StateMgt()
{
    const[stid,setStId]=useState();
    const[stname,setStName]=useState();
    const[status,setStatus]=useState();
    const[stlist,setStList]=useState([]);
    const[isupdatestname,setIsUpdateStName]=useState(false);
    const[isupdatestatus,setIsUpdateStatus]=useState(false);

const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;

    const handleStIdText=(evt)=>{
        setStId(evt.target.value);
    }

    const handleStNameText=(evt)=>{
        setStName(evt.target.value);
    }
    const handleStatusText=(evt)=>{
        setStatus(evt.target.value);

    }
    const handleAddNewButton=()=>{
        
        axios.get(REACT_APP_BASE_API_URL+"/state/getall").then((res)=>{
            setStId(res.data.length+1);
            setStatus(1);
        }).catch((err)=>{
            alert(err);
        });
    }   
    const handleSaveButton=()=>{
      
        if(stid==""||stid==undefined||stname==""||stname==undefined||status==""||status==undefined)
            {
              alert("Please Fill all fields");
              return;
            }
            else{         

                axios.get(REACT_APP_BASE_API_URL+"/state/searchbyname/"+stname).then((res)=>{
                    if(res.data.stname!=undefined)
                    {
                         alert("State Name already Exist");   
                    }else{                       
                   
        var obj={
            stid:stid,
            stname:stname,
            status:status
        }       
        axios.post(REACT_APP_BASE_API_URL+"/state/save/",obj).then((res)=>{
            alert(res.data);
            setStId("");
            setStName("");
            setStatus("");
        }).catch((err)=>{
            alert(err);
        });
    }
                    
}).catch((err)=>{
    alert(err);
});
    }
    }

    const handleShowButton=()=>{
        axios.get(REACT_APP_BASE_API_URL+"/state/getall").then((res)=>{
            setStList(res.data);
        }).catch((err)=>{
            alert(err);
        });
    }

    const handleSearchButton=()=>{
        
        if(stid!=undefined&&stid!="")
        {
        axios.get(BASE_API_URL+"/state/search/"+stid).then((res)=>{
            
            if(res.data.stid!=undefined)
            {
            setStId(res.data.stid);
            setStName(res.data.stname);
            setStatus(res.data.status);
            }else{
                alert("Data Not Found");
            }
        }).catch((err)=>{
            alert(err);
        });
    }
     if(stname!=undefined&&stname!="")
        {
            axios.get(`${REACT_APP_BASE_API_URL}/state/searchbyname/${stname}`).then((res)=>{
           
            if(res.data.stid!=undefined)
                {
                setStId(res.data.stid);
                setStName(res.data.stname);
                setStatus(res.data.status);
                }else{
                    alert("Data Not Found");
                }
        }).catch((err)=>{
            alert(err);
        });
    }
    }

    const handleUpdateButton=()=>{
      
        if(stid==""||stid==undefined||stname==""||stname==undefined||status==""||status==undefined)
            {
              alert("Please Fill all fields");
              return;
            }
            else{         

                // axios.get("http://localhost:9191/state/searchbyname/"+stname).then((res)=>{
                //     if(res.data.stname!=undefined)
                //     {
                //          alert("State Name already Exist");   
                //     }else{
                        
                   
        var obj={
            stid:stid,
            stname:stname,
            status:status
        }       
        axios.put(REACT_APP_BASE_API_URL+"/state/update/",obj).then((res)=>{
            alert(res.data);
            setStId("");
            setStName("");
            setStatus("");
        }).catch((err)=>{
            alert(err);
        });
    }
                    
// }).catch((err)=>{
//     alert(err);
// });
  //  }
    }

    const handleDeleteButton=()=>{
        
        if(stid!=undefined&&stid!="")
        {
        axios.delete(REACT_APP_BASE_API_URL+"/state/delete/"+stid).then((res)=>{            
            alert(res.data);
        }).catch((err)=>{
            alert(err);
        });
    }else{
        alert("Fill State Id to Delete")
    }
     
    }

    return(
        <div>
            <center>
                <h6>State Mangement</h6>
                <div className="myDiv">
                    <center>
                    <table>
                        <tr>
                            <td>State Id</td>
                            <td>
                                <input type="number" onChange={handleStIdText} value={stid} className="form-control" />
                            </td>
                        </tr>
                        <tr>
                            <td>State Name</td>
                            <td>
                                <input type="text" onChange={handleStNameText}
                                className="form-control" value={stname}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>
                                <input type="text" onChange={handleStatusText}
                                className="form-control" value={status}
                                />
                            </td>
                        </tr>
                        <tr>
                         
                        </tr>
                        <tr>
                            
                        </tr>
                    </table>
                    <table>
                                <tr>
                            <td>
                            <button type="submit" onClick={handleAddNewButton}
                            
                            className="btn btn-primary"
                            >New</button>
                            </td>
                            <td>
                                <button type="submit" onClick={handleSaveButton}
                                className="btn btn-success"
                                >Save</button>
                            </td>
                            <td>
                                <button type="submit" onClick={handleShowButton}
                                className="btn btn-secondary"
                                >Show</button>
                            </td>
                            <td>
                                <button type="submit" onClick={handleSearchButton}
                                className="btn btn-success"
                                >Search</button>
                            </td>
                            <td>
                                <button type="submit" onClick={handleUpdateButton}
                                className="btn btn-primary"
                                >Update</button>
                            </td>
                            <td>
                                <button type="submit" onClick={handleDeleteButton}
                                className="btn btn-danger"
                                >Delete</button>
                            </td>
                            </tr>
                            </table>
                    </center>
                </div>
                <div className="myDiv2">
                <center>
                            <table>
                                <tr>
                                    <th>State Id</th>
                                    <th>State Name</th>
                                    <th>Status</th>
                                </tr>
                                {
                                    stlist.map((item)=>(
                                        <tr>
                                            <td>{item.stid}</td>
                                            <td>{item.stname}</td>                                       
                                            <td>
                                            {item.status==1 ? <h5>enabled </h5>:<h5>disable </h5>}
                                           
                                            </td>
                                        </tr>
                                    ))
                                }
                            </table>
                            </center>
                </div>
            </center>
        </div>
    );
}export default StateMgt;