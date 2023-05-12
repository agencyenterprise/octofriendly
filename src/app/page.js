'use client'
import { Octokit } from 'octokit'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const params = useSearchParams()
  const octokit = useRef(null)
  const [log, setLog] = useState([])
  const [user, setUser] = useState(null)
  const [org, setOrg] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isAuthed, setIsAuthed] = useState(null)


  const logLine = line => {
    setLog(oldLog => [...oldLog, line])
  }

  const getKit = () => {
    const effect = async () => {
      let token = localStorage.getItem('accessToken')
      const code = params.get('code')
      
      if (code && !token) {
        const request = await fetch(`/api/callback?code=${code}`)
        const json = await request.json()
        localStorage.setItem('accessToken', json.token)
        token = json.token
      }

      if (!token) {
        setIsAuthed(false)
        return
      } else {
        setIsAuthed(true)
      }

      octokit.current = new Octokit({ auth: token })
      const {
        data: { login },
      } = await octokit.current.rest.users.getAuthenticated()
      logLine(`Logged in as ${login}`)
      setUser(login)

    }
    effect()
  }

  const startFollowing = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('no loged in user')
      return
    }

    setIsRunning(true)
    
    let follows = []
    let followsPage = 1
    try {
      while (true) {
        const pageFollows = await octokit.current.rest.users.listFollowedByAuthenticatedUser({
          per_page: 100,
          page: followsPage
        })
        follows = [...follows, ...pageFollows.data.map(u => u.login)]
        if (!pageFollows.data.length) {
          break
        }
        followsPage++
      }
    } catch (e) {
      // nothing
    }
    logLine(`Found ${follows.length} users being followed`)
    console.log(follows)

    let members = []
    let membersPage = 1

    try {
      while (true) {
        const pageMembers = await octokit.current.rest.orgs.listMembers({
          org,
          per_page: 100,
          page: membersPage
        })
        members = [...members, ...pageMembers.data.map(u => u.login)]
        if (!pageMembers.data.length) {
          break
        }
        membersPage++
      }
    } catch (e) {
      //nothing
    }
    logLine(`Found ${members.length} members in ${org}`)
    console.log(members)

    const queue = members.filter(m => !follows.includes(m) && !follows.includes(user))
    logLine(`Starting following ${queue.length} new users`)
    console.log(queue)

    let newFollows = 0

    for (const q of queue) {
      // if (!isRunning && newFollows > 1) {
      //   logLine(`Stopping early`)
      //   break
      // }
      logLine(`Following ${q}...`)

      try {
        const status = await octokit.current.rest.users.follow({
          username: q
        })
        console.log('status', status)
      } catch (e) {
        logLine(`Failed following ${q}`)
        console.log(e)
      }
      newFollows++
    }

    setIsRunning(false)

    logLine(`Finished following ${queue.length} new users`)

  }

  const stopFollowing = () => {
    setIsRunning(false)
  }

  const goAuth = () => {
    location.href = '/api/auth'
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    location.href = location.href
  }

  useEffect(getKit, [params])


  return (
    <>
      <main className="flex flex-col items-center p-24 max-w-lg m-auto">
        <h1 className="text-4xl font-medium pb-8">Octofriendly</h1>
        <div className="m-0 mb-6 leading-8">
          <p>Follow all members of a GitHub org</p>
          <p className="text-zinc-500 text-sm">If you are a not a member of that organization, you will only follow publicly available members.</p>
        </div>

        {!isAuthed &&
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-3" onClick={goAuth}>Authorize GitHub</button>
        }

        {isAuthed &&
          <>
            <form onSubmit={startFollowing} className="w-full">
              <div className="w-full">
                <label htmlFor="org" className="text-md leading-6 text-white">
                  Organization
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="org"
                    className="mb-3 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="agencyenterprise"
                    value={org}
                    onChange={e => setOrg(e.target.value)}
                  />
                </div>
              </div>
              {!isRunning && 
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-3" disabled={!org}>Start</button>
              }
              {/* {isRunning && 
                <button onClick={stopFollowing} className="rounded-xl">Stop</button>
              } */}
            </form>
            <div className="mt-6 z-10 font-mono text-sm flex w-full">
              <div className="left-0 top-0 w-full border-bpb-6 pt-8 border-neutral-800 rounded-xl border lg:p-4 bg-zinc-800/30">
                {log.map((line, k) => 
                  <div key={k}>
                    {line}
                  </div>
                )}
              </div>  
            </div>
            <button onClick={logout} className="text-right underline mt-5">Logout</button>

          </>
        }

        <footer className="mt-8 text-sm">
          Created with 🐙 by <a href="https://ae.studio" className="text-orange-400 underline">ae.studio</a>
        </footer>
        
      </main>
    </>
  )
}
