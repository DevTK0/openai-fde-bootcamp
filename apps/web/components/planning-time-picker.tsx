"use client"
import {
  TimePicker,
  TimePickerLabel,
  TimePickerInputGroup,
  TimePickerInput,
  TimePickerSeparator,
  TimePickerTrigger,
  TimePickerContent,
  TimePickerHour,
  TimePickerMinute,
  TimePickerSecond,
  type TimePickerProps,
} from "@workspace/ui/components/time-picker"
export function PlanningTimePicker({
  label,
  showSeconds = false,
  ...props
}: TimePickerProps & { label: string }) {
  return (
    <TimePicker
      {...props}
      locale="en-GB"
      showSeconds={showSeconds}
      className="space-y-1"
    >
      <TimePickerLabel>{label}</TimePickerLabel>
      <TimePickerInputGroup className="h-9 w-auto min-w-36">
        <TimePickerInput segment="hour" aria-label={`${label} hours`} />
        <TimePickerSeparator />
        <TimePickerInput segment="minute" aria-label={`${label} minutes`} />
        {showSeconds && (
          <>
            <TimePickerSeparator />
            <TimePickerInput segment="second" aria-label={`${label} seconds`} />
          </>
        )}
        <TimePickerTrigger aria-label={`Choose ${label.toLowerCase()}`} />
      </TimePickerInputGroup>
      <TimePickerContent aria-label={`${label} picker`}>
        <TimePickerHour format="2-digit" aria-label="Hours" />
        <TimePickerMinute aria-label="Minutes" />
        {showSeconds && <TimePickerSecond aria-label="Seconds" />}
      </TimePickerContent>
    </TimePicker>
  )
}
