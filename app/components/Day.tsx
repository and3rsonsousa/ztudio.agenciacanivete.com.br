import { format, isEqual, isSameMonth, isToday } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { scaleUp } from "~/lib/animations";
import type { DayModel } from "~/lib/models";
import { Action } from "./Actions";
import Celebration from "./Celebrations";

export default function Day({
  day,
  selectedDay,
  firstDayOfCurrentMonth,
  setSelectedDayAndCurrentMonth,
}: {
  day: DayModel;
  selectedDay: Date;
  firstDayOfCurrentMonth: any;
  setSelectedDayAndCurrentMonth: (date: Date) => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.currentTarget.classList.add("dragover");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("dragover");
      }}
      onDrop={(e) => {
        e.currentTarget.classList.add("dropped");
      }}
      className={`calendar-day${isToday(day.date) ? " is-today" : ""}${
        isSameMonth(day.date, firstDayOfCurrentMonth) ? "" : " not-this-month"
      }${isEqual(selectedDay, day.date) ? " is-selected" : ""} transition `}
    >
      <div className="px-2 lg:px-1">
        <button
          className="day-button appearance-none"
          onClick={() => setSelectedDayAndCurrentMonth(day.date)}
        >
          {format(day.date, "d")}
        </button>
      </div>

      {/* {index >= 11 && index <= 21 ? (
                  <div
                    className={`relative mt-2 -mb-1`}
                    style={{ height: 24 + "px" }}
                  >
                    {index === 11 || index % 7 === 0 ? (
                      <div
                        className={`absolute z-10 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap bg-doing-500 py-1 px-2 text-xs font-medium text-white  transition hover:bg-doing-600 ${
                          index === 11
                            ? Math.ceil(21 / 7) * 7 > 21
                              ? " ml-1 rounded "
                              : " ml-1 rounded-l "
                            : " rounded-r"
                        }`}
                        style={{
                          width:
                            " calc(" +
                            100 * (18 - index > 7 ? 7 : 21 - index + 1) +
                            "% - " +
                            (Math.ceil(21 / 7) * 7 > 21 ? 8 : 4) +
                            "px)",
                        }}
                      >
                        {index === 11 || index % 7 === 0
                          ? "Black Friday - Newbyte"
                          : null}
                      </div>
                    ) : null}
                  </div>
                ) : null} */}
      <AnimatePresence>
        <motion.div
          className="mt-2"
          variants={scaleUp(0.1)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {day.actions.map((action, index) => (
            <Action key={index} action={action} />
          ))}
        </motion.div>
        <div className="p-1">
          {day.celebrations.map((celebration) => (
            <Celebration celebration={celebration} key={celebration.id} small />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
