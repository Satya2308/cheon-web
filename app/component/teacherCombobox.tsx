import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import {
  ChevronUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { useDebounce } from '~/hook/useDebounce'
import { useTeacherSearch } from '~/hook/useSearchTeacher'

interface Teacher {
  id: number
  name: string
  email: string
  department: string
}

interface TeacherComboboxProps {
  value: Teacher | null
  onChange: (teacher: Teacher | null) => void
  placeholder?: string
}

export default function TeacherCombobox({
  value,
  onChange,
  placeholder = 'ស្វែងរកគ្រូបង្រៀន...',
}: TeacherComboboxProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { teachers, loading, error, searchTeachers } = useTeacherSearch()

  useEffect(() => {
    searchTeachers(debouncedQuery)
  }, [debouncedQuery])

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-sm">
          <div className="flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-3" />
            <Combobox.Input
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
              displayValue={(teacher: Teacher) => teacher?.name || ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </Combobox.Button>
          </div>
        </div>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {loading && (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>កំពុងស្វែងរក...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="relative cursor-default select-none py-2 px-4 text-red-600">
              មានបញ្ហា: {error}
            </div>
          )}

          {!loading &&
            !error &&
            teachers.length === 0 &&
            query.trim() !== '' && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                រកមិនឃើញគ្រូបង្រៀន
              </div>
            )}

          {!loading &&
            teachers.map((teacher: Teacher) => (
              <Combobox.Option
                key={teacher.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`
                }
                value={teacher}
              >
                {({ selected, active }) => (
                  <>
                    <div className="block truncate">
                      <div
                        className={`font-medium ${
                          selected ? 'font-bold' : 'font-normal'
                        }`}
                      >
                        {teacher.name}
                      </div>
                      <div
                        className={`text-sm ${
                          active ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {teacher.department} • {teacher.email}
                      </div>
                    </div>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-blue-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
