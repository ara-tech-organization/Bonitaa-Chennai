import { useCallback, useMemo, useState } from 'react'
import { CallContext } from './callStore'

/**
 * Routes every call action through one confirmation modal, so the dialer never
 * opens without the patient seeing which clinic they are calling.
 *
 * `pendingBranch`: undefined = idle, null = generic Chennai, string = branch.
 */
export default function CallProvider({ children }) {
  const [pendingBranch, setPendingBranch] = useState(undefined)

  const requestCall = useCallback((branchName) => {
    setPendingBranch(branchName ?? null)
  }, [])

  const cancelCall = useCallback(() => setPendingBranch(undefined), [])

  const value = useMemo(
    () => ({ pendingBranch, isCalling: pendingBranch !== undefined, requestCall, cancelCall }),
    [pendingBranch, requestCall, cancelCall],
  )

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>
}
