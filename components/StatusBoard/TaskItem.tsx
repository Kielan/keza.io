import React from 'react'
import styled from 'styled-components'
import { ITaskState, ITeamListUserState } from './types.ts'
import ActivityIcon from './Icons/Activity.tsx'
import AttachIcon from './Icons/Attach.tsx'
import TasksIcon from './Icons/Tasks.tsx'
import Avatar from './Avatar.tsx'
import TaskModal from './TaskModal.tsx'
import Score from './Score.tsx'

const Wrapper = styled.div`
  display: flex;
  justify-content: ${(props: ITaskProps) => !props.option && 'space-around'};
  flex-direction: ${(props: ITaskProps) => (props.option ? 'column' : 'column')};
  cursor: move;
  border-radius: 20px;
  padding: 15px;
  margin: 0 5px 10px 5px;
  background: ${props =>
    props.drag
      ? `repeating-linear-gradient(
    45deg,
    white,
    white 5px,
    #f1f1f5 5px,
    #f1f1f5 10px
  )`
      : 'white'};
  border: ${props => (props.drag ? '1px dashed #92929d' : '1px dashed white')};
  opacity: ${props => (props.drag ? '0.999' : '1')};
`
const Users = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
  margin: 10px 0 0 0;
`

interface ITaskProps {
  taskItem: ITaskState
  key: string
  option: boolean
  drag?: boolean
}

const TaskItem: React.FC<ITaskProps> = props => {
  const { taskItem } = props

  const [modal, setModal] = React.useState<boolean>(false)
  const [drag, setDrag] = React.useState<boolean>(false)

  const onDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    setDrag(prevState => !prevState)
    e.dataTransfer.setData('text/html', taskItem.id)
  }

  const toggleModal = (): void => {
    setModal(prevState => !prevState)
  }

  const users = taskItem.users.map(
    (user: ITeamListUserState, idx: number): object => (
      <Avatar key={idx} {...user} />
    )
  )

  return (
    <>
      <Wrapper
        {...props}
        draggable={true}
        onDragStart={onDragStart}
        onClick={toggleModal}
				drag={drag}
      >
        <TaskItemTitle data={taskItem} />
        <TaskItemInfo data={taskItem} />
				<Score taskItem={taskItem} />
        <Users>{users}</Users>
      </Wrapper>
      <>{modal && <TaskModal {...taskItem} onClose={toggleModal} />}</>
    </>
  )
}

const TextStyles = styled.div`
  font-size: 14px;
  letter-spacing: 0.1px;
  color: #92929d;
`
const TaskItemTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled(TextStyles)`
  color: #171725;
  margin-bottom: 7px;
  text-decoration: ${(props: ITitleProps) =>
    props.data.score.days === 0 && 'line-through'};
`
const Team = styled(TextStyles)`
  color: #696974;
`

interface ITitleProps {
  data: ITaskState
}

const TaskItemTitle: React.FC<ITitleProps> = props => {
  const { data } = props

  return (
    <Wrapper>
      <TaskItemTitleWrapper {...props}>
				{data.title}
			</TaskItemTitleWrapper>
      <Team>{data.team}</Team>
    </Wrapper>
  )
}

const TaskItemInfoTextStyles = styled.div`
  font-size: 14px;
  letter-spacing: 0.1px;
  color: #92929d;
`
const InfoWrapper = styled.div`
  display: flex;
  margin: 15px 0 10px 0;
`
const Attach = styled(TaskItemInfoTextStyles)`
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
  }
`
const Status = styled(TaskItemInfoTextStyles)`
  margin: 0 15px 0 20px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 5px;
    fill: #92929d;
    width: 14px;
    height: 14px;
  }
`
const Activity = styled(Status)`
  background-color: ${(props: IInfoProps) => props.data.score.colors.bg};
  color: ${(props: IInfoProps) => props.data.score.colors.text};
  padding: 5px;
  border-radius: 5px;
  margin: 0;
  span:last-child {
    margin-left: 5px;
  }
  svg {
    fill: ${(props: IInfoProps) => props.data.score.colors.text};
  }
`

interface IInfoProps {
  data: ITaskState
}

const TaskItemInfo: React.FC<IInfoProps> = props => {
  const { data } = props

  return (
    <InfoWrapper>
      <Attach>
        <AttachIcon />
        {data.attach}
      </Attach>
      <Status>
        <TasksIcon />
        {data.status}
      </Status>
      {data.score.days > 0 && (
        <Activity {...props}>
          <ActivityIcon />
          <span>{data.score.days}</span>
          <span>days left</span>
        </Activity>
      )}
    </InfoWrapper>
  )
}

export default TaskItem
