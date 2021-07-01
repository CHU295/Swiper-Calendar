import React, { memo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useUpdateEffect from "@/assets/hook/useUpdateEffect";
import moment from "moment";
import { cloneDeep, isEqual } from "lodash";
import "swiper/swiper.min.css";
import "./index.less";

const getDays = (moment_) => {
  let days = [];
  for (let index = 0; index < moment_.daysInMonth(); index++) {
    const data_ = moment_.format("YYYY-MM-") + (index + 1);
    let obj = {
      day: index + 1,
      date: data_,
      weekday: moment(data_).weekday(),
    };
    if (obj.weekday === 6 || obj.weekday === 0) {
      obj.disable = true;
    }
    days.push(obj);
  }
  let more_arr = [];
  for (let index = 0; index < days[0].weekday; index++) {
    more_arr.push({
      day: moment(days[0].date)
        .subtract(index + 1, "day")
        .get("date"),
      disable: true,
    });
  }
  return more_arr.concat(days);
};

const getObj = (mo_) => {
  return {
    str: mo_.format("YYYY-MM"),
    label: mo_.format("YYYY年MM月"),
    days: getDays(mo_),
  };
};

const getInitList = () => {
  let arr = [];
  arr.push(getObj(moment()));
  arr.push(getObj(moment().add(1, "month")));
  arr.push(getObj(moment().subtract(1, "month")));
  return arr;
};

const Calendar_H5 = () => {
  const [list, set_list] = useState(getInitList());
  const [activeIndex, set_activeIndex] = useState();

  useUpdateEffect(() => {
    window.moment = moment;
    let arr = cloneDeep(list);
    if (activeIndex === 1) {
      let mo_ = moment(arr[1].str);
      arr[0] = getObj(mo_.subtract(1, "month"));
      arr[2] = getObj(mo_.add(2, "month"));
    } else if (activeIndex === 2) {
      let mo_ = moment(arr[2].str);
      arr[1] = getObj(mo_.subtract(1, "month"));
      arr[0] = getObj(mo_.add(2, "month"));
    } else if (activeIndex === 0) {
      let mo_ = moment(arr[0].str);
      arr[2] = getObj(mo_.subtract(1, "month"));
      arr[1] = getObj(mo_.add(2, "month"));
    }
    set_list(arr);
  }, [activeIndex]);

  return (
    <div className="com_Calendar_H5">
      <Swiper
        className="mySwiper"
        loop={true}
        onSlideChange={(e) => {
          set_activeIndex(e.realIndex);
        }}
      >
        {list.map((item) => (
          <SwiperSlide key={item.str}>
            <div className="calendar">
              <div className="title">{item.label}</div>
              <div className="main_">
                {item.days.map((day_, index) => (
                  <div className="part" key={item.str + day_.day + index}>
                    <span
                      className={
                        "date " +
                        (day_.day === 2 ? "check_ " : "") +
                        (day_.day === 4 ? "existence_ " : "") +
                        (day_.disable ? "disable_ " : "")
                      }
                    >
                      {day_.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default memo(Calendar_H5, (nextProps, prevProps) => {
  return isEqual(nextProps, prevProps);
});
