import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

// import Header from './Header';
import TeamAddModal from './TeamAddModal';
import Calendar from '@toast-ui/react-calendar';
import { TZDate } from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import { theme } from './theme';

import moment from 'moment';
import instance from '../../api';

const viewModeOptions = [
  {
    title: 'MONTHLY',
    value: 'month',
  },
  {
    title: 'WEEKLY',
    value: 'week',
  },
  {
    title: 'DAILY',
    value: 'day',
  },
];

const CalendarContainer = styled.div`
  display: flex;
  height: 90vh;
`;
const ShowMenuBar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(235, 237, 239);
  width: 8vw;
`;
const ShowMenuBarHeader = styled.div`
  height: 3vh;
  color: grey;
  text-align: center;
  font-weight: 100;
  font-size: 22px;
  padding: 8px;
  // border-bottom: 1px solid rgb(235, 237, 239);
  margin-bottom: 22px;
`;

const TeamList = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  text-align: center;
  font-size: 20px;
  padding: 2px;
`;
const Input = styled.input`
  opacity: 1;
  -webkit-appearance: none;
  cursor: pointer;
  height: 25px;
  width: 25px;
  box-shadow:
    -10px -10px 10px rgba(255, 255, 255, 0.8),
    10px 10px 10px rgba(0, 0, 70, 0.18);
  border-radius: 50%;
  border: none;

  transition: 0.5s;
  &:checked {
    box-shadow:
      -10px -10px 10px rgba(255, 255, 255, 0.8),
      10px 10px 10px rgba(70, 70, 70, 0.18),
      inset -10px -10px 10px rgba(255, 255, 255, 0.3),
      inset 10px 10px 10px rgba(70, 70, 70, 0.18);
    transition: 0.5s;
    background-color: ${(props) => props.bgColor};
  }
`;
const MIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60vw;
`;
const CalendarBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const CalendarHeader = styled.div`
  width: 100%;
  height: 100px;
  color: grey;
`;
const DateControlBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DateBox = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const PrevBtn = styled.button`
  border-radius: 50px;
  box-shadow:
    -1px -1px 10px rgba(180, 180, 180, 0.1),
    1px 1px 10px rgba(180, 180, 180, 0.1);
  outline: none;
  cursor: pointer;
  border: none;
  font-weight: 100;
  font-size: 14px;
  background-color: rgb(254, 250, 250);
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const NumberBox = styled.div`
  display: flex;
  justify-content: center;
  width: 250px;
  font-size: 18px;
  font-weight: 900;
`;
const NextBtn = styled.button`
  border-radius: 50px;
  box-shadow:
    -1px -1px 10px rgba(180, 180, 180, 0.1),
    1px 1px 10px rgba(180, 180, 180, 0.1);
  outline: none;
  cursor: pointer;
  border: none;
  font-size: 14px;
  background-color: rgb(254, 250, 250);
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;

const ClickBox = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const TodayBtn = styled.button`
  border: none;
  background-color: rgb(254, 250, 250);
  outline: none;
  cursor: pointer;
  font-size: 14px;
  color: grey;
  &&:hover {
    transform: translateY(1px);
    box-shadow: none;
  }
  &&:active {
    opacity: 0.5;
  }
`;
const DateViewSelectBox = styled.div`
  margin-top: 10px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    background-color: rgb(254, 250, 250);
    font-size: 12px;
    color: grey;
  }
`;

export default function TUICalendar({
  schedules,
  view,
  events,
  setEvents,
  setSelectedEvent,
}) {
  const calendarRef = useRef(null);
  const [selectedDateRangeText, setSelectedDateRangeText] = useState('');
  const [selectedView, setSelectedView] = useState(view);

  console.log(schedules);
  console.log(schedules[0]?.team);
  const initialCalendars = schedules?.map((schedule) => ({
    id: schedule?.team.id,
    name: schedule?.team.teamname,
    backgroundColor: schedule?.team.color,
    borderColor: schedule?.team.color,
    dragBackgroundColor: schedule?.team.color,
    isChecked: true,
  }));

  const initialEvents = schedules?.map((schedule) => ({
    id: schedule.id,
    calendarId: schedule.team.id,
    title: schedule.title,
    start: new TZDate(schedule.start_date),
    end: new TZDate(schedule.end_date),
  }));

  const [selectedCalendars, setSelectedCalendars] = useState(
    initialCalendars.map((calendar) => ({
      ...calendar,
      isChecked: true, // 선택 상태를 초기화합니다.
    })),
  );
  console.log('selectedCalendars', selectedCalendars);
  console.log('initialCalendars', initialCalendars);

  const filteredEvents = initialEvents.filter(
    (event) =>
      selectedCalendars.find((calendar) => calendar.id === event.calendarId)
        ?.isChecked,
  );
  console.log('filteredEvents', filteredEvents);
  const getCalInstance = useCallback(
    () => calendarRef.current?.getInstance?.(),
    [],
  );

  const updateRenderRangeText = useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText;

    switch (viewName) {
      case 'month': {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? '0' : ''}${month}-${
          date < 10 ? '0' : ''
        }${date}`;
        const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
          endDate < 10 ? '0' : ''
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, [getCalInstance]);

  useEffect(() => {
    setSelectedView(view);
  }, [view]);

  useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  const onAfterRenderEvent = (res) => {
    console.group('onAfterRenderEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();
  };

  const onBeforeDeleteEvent = (res) => {
    console.group('onBeforeDeleteEvent');
    console.log('Event Info : ', res.title);
    console.groupEnd();

    const { id, calendarId } = res;

    getCalInstance().deleteEvent(id, calendarId);
  };

  const onChangeSelect = (ev) => {
    setSelectedView(ev.target.value);
  };

  const onClickDayName = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev) => {
    if (ev.target.tagName === 'BUTTON') {
      const button = ev.target;
      const actionName = (
        button.getAttribute('data-action') ?? 'month'
      ).replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickEvent = (res) => {
    console.group('onClickEvent');
    console.log('MouseEvent : ', res.nativeEvent);
    console.log('Event Info : ', res.event);
    console.groupEnd();

    setSelectedEvent(res.event);
  };

  const onClickTimezonesCollapseBtn = (timezoneCollapsed) => {
    console.group('onClickTimezonesCollapseBtn');
    console.log('Is Timezone Collapsed?: ', timezoneCollapsed);
    console.groupEnd();

    const newTheme = {
      'week.daygridLeft.width': '100px',
      'week.timegridLeft.width': '100px',
    };

    getCalInstance().setTheme(newTheme);
  };

  const onBeforeUpdateEvent = (updateData) => {
    console.group('onBeforeUpdateEvent');
    console.log('Event Info: ', updateData);
    console.groupEnd();

    // 서버에 보낼 이벤트 데이터 준비
    // const eventForUpdate = {
    //   id: eventData.id,
    //   team: eventData.calendarId,
    //   title: eventData.title,
    //   description: eventData.location,
    //   start_date: eventData.start,
    //   end_date: eventData.end,
    //   state: eventData.state,
    // };

    // 업데이트 API 호출 예
    // axios.put(`url/${eventData.id}`, eventForUpdate);

    const targetEvent = updateData.event;
    const changes = { ...updateData.changes };

    getCalInstance().updateEvent(
      targetEvent.id,
      targetEvent.calendarId,
      changes,
    );

    getCalInstance().render();
  };

  const onBeforeCreateEvent = async (eventData) => {
    console.log(eventData, '이벤트 데이터에 제발 팀이름 있어라');
    const start_date = moment(eventData.start.d.d).format('YYYY-MM-DD HH:mm');
    const end_date = moment(eventData.end.d.d).format('YYYY-MM-DD HH:mm');
    try {
      const eventForBack = await instance.post('/api/v1/schedules/', {
        title: eventData.title,
        description: eventData.location,
        state: eventData.state === 'Busy' ? 'To do' : 'Done',
        start_date,
        end_date,
        team: eventData.calendarId,
      });

      const event = {
        calendarId: eventData.calendarId || '',
        calendarName: eventData.teamname,
        id: eventForBack.id,
        title: eventData.title,
        isAllday: eventData.isAllday,
        start: eventData.start,
        end: eventData.end,
        category: eventData.isAllday ? 'allday' : 'time',
        dueDateClass: '',
        location: eventData.location,
        state: eventData.state,
        isPrivate: eventData.isPrivate,
      };
      console.log('일정 생성 API 응답', eventForBack.data);

      getCalInstance().createEvents([event]);
      setEvents([...events, event]);
      setSelectedEvent(event);
    } catch (error) {
      console.log('일정 생성 API 요청 실패', error);
    }
  };

  return (
    <CalendarContainer>
      <ShowMenuBar>
        <ShowMenuBarHeader></ShowMenuBarHeader>
        {selectedCalendars.map((calendar) => (
          <TeamList key={calendar.id}>
            <Input
              type="checkbox"
              checked={calendar.isChecked}
              bgColor={calendar.backgroundColor} //
              onChange={() => {
                const updatedCalendars = selectedCalendars.map((item) =>
                  item.id === calendar.id
                    ? { ...item, isChecked: !item.isChecked }
                    : item,
                );
                setSelectedCalendars(updatedCalendars);
              }}
            />
            {calendar.name}
          </TeamList>
        ))}
        <TeamAddModal />
      </ShowMenuBar>
      <MIDContainer>
        {/* <Header
          data={initialEvents}
          initialCalendars={initialCalendars}
          initialEvents={initialEvents}
        /> */}
        <CalendarBox>
          <CalendarHeader>
            <DateControlBox>
              <DateBox>
                <PrevBtn
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-prev"
                  onClick={onClickNavi}
                >
                  ◀️
                </PrevBtn>
                <NumberBox>
                  <span className="render-range">{selectedDateRangeText}</span>
                </NumberBox>

                <NextBtn
                  type="button"
                  className="btn btn-default btn-sm move-day"
                  data-action="move-next"
                  onClick={onClickNavi}
                >
                  ▶️
                </NextBtn>
              </DateBox>

              <ClickBox>
                <DateViewSelectBox>
                  {viewModeOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        onChangeSelect({ target: { value: option.value } })
                      }
                      className={selectedView === option.value ? 'active' : ''}
                    >
                      {option.title}
                    </button>
                  ))}
                  <TodayBtn
                    type="button"
                    className="btn btn-default btn-sm move-today"
                    data-action="move-today"
                    onClick={onClickNavi}
                  >
                    TODAY
                  </TodayBtn>
                </DateViewSelectBox>
              </ClickBox>
            </DateControlBox>
          </CalendarHeader>{' '}
          <Calendar
            height="77vh"
            calendars={selectedCalendars}
            month={{
              startDayOfWeek: 0,
              isAlways6Weeks: false,
            }}
            events={filteredEvents}
            template={{
              allday(event) {
                return `[All day] ${event.title}`;
              },
              popupIsAllday() {
                return '하루 종일';
              },
              popupSave() {
                return '저장';
              },
              titlePlaceholder() {
                return '제목';
              },
              popupStateFree() {
                return 'Done';
              },
              popupStateBusy() {
                return 'Todo';
              },
              locationPlaceholder() {
                return '세부 내용';
              },
              popupEdit() {
                return '편집';
              },
              popupDelete() {
                return '삭제';
              },
              popupUpdate() {
                return '저장';
              },
            }}
            theme={theme}
            timezone={{
              zones: [
                {
                  timezoneName: 'Asia/Seoul',
                  displayLabel: 'Seoul',
                  tooltip: 'UTC+09:00',
                },
              ],
            }}
            useDetailPopup={false}
            useFormPopup={true}
            view={selectedView}
            week={{
              showTimezoneCollapseButton: true,
              timezonesCollapsed: false,
              eventView: true,
              taskView: true,
            }}
            ref={calendarRef}
            onAfterRenderEvent={onAfterRenderEvent}
            onBeforeDeleteEvent={onBeforeDeleteEvent}
            onClickDayname={onClickDayName}
            onClickEvent={onClickEvent}
            onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
            onBeforeUpdateEvent={onBeforeUpdateEvent}
            onBeforeCreateEvent={onBeforeCreateEvent}
          />{' '}
        </CalendarBox>
      </MIDContainer>
    </CalendarContainer>
  );
}
