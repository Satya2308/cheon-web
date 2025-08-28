import { useState } from 'react'
import { Download } from '~/icons'
import { authApi } from '~/utils/axios'
import { toast } from './ui/toast'

interface Props {
  teacherId?: number
  teacherName?: string
  yearId: number
  yearName: string
  disable: boolean
}

export function ExpTeacherScheduleBtn(props: Props) {
  const { teacherId, yearId, yearName, disable = false } = props
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const apiUrl = `/years/${yearId}/teachers/${teacherId}/export`
      const res = await authApi.get(apiUrl, {
        responseType: 'blob', // IMPORTANT for Excel
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      })
      // Create download link
      const url = window.URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `Timetable_${yearName}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      toast('មានបញ្ហាក្នុងការនាំចេញកាលវិភាគ។ សូមព្យាយាមម្តងទៀត។')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={disable || isExporting}
      className="btn btn-sm gap-2"
    >
      {isExporting ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          កំពុងនាំចេញ...
        </>
      ) : (
        <>
          <Download size={16} />
          នាំចេញ Excel
        </>
      )}
    </button>
  )
}
