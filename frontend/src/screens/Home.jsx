import React,{useContext , useEffect} from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios.js'
import {useNavigate} from 'react-router-dom'

const Home = () => {

  const {user} = useContext(UserContext)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState('')
  const [projects, setProjects] = React.useState([])
  const navigate = useNavigate()

  function createProject(e) {
    e.preventDefault()
    console.log({projectName})
    axios.post('/projects/create', {
      name: projectName,
    }).then((res) => {
      console.log(res.data)
      setIsModalOpen(false)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
      axios.get('/projects/all').then((res) => {
        setProjects(res.data.projects)
      }).catch((err) => {
        console.log(err)
      })
  }, [user])

  return (
    <main className='p-4 bg-black'>
      <div className="projects text-white">
        <button onClick={()=>setIsModalOpen(true)} className="project p-4 border border-slate-300 rounded-md">
        New Project
        <i className="ri-link ml-2"></i>
        </button>

        {
          projects.map((project) => (
            <div  onClick={()=>{navigate(`/project`,{
              state: {projectId: project._id, projectName: project.name, createdAt: project.createdAt}
            })}} key={project._id} className="project p-4 border border-slate-300 rounded-md mt-4">
              <h2 className="text-lg font-bold">{project.name}</h2>
              <p className="text-sm text-gray-500">Created on: {new Date(project.createdAt).toLocaleDateString()}</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">View</button>
            </div>
          ))
        }

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form
          onSubmit={createProject}
        >
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name
            </label>
            <input onChange={(e)=>setProjectName(e.target.value)} value={projectName}
          type="text"
          id="projectName"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          placeholder="Enter project name"
          required
            />
          </div>
          <div className="flex justify-end">
            <button
          type="button"
          className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          onClick={() => setIsModalOpen(false)}
            >
          Cancel
            </button>
            <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
          Create
            </button>
          </div>
        </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home
