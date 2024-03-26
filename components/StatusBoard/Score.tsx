import React from 'react'
import { AppState } from 'store'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { ITaskState } from 'types.ts'

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props: IScoreProps) =>
    props.option ? 'column' : 'column'};
  align-items: ${(props: IScoreProps) => !props.option && 'center'};
`
const ScoreLineTitle = styled.div`
  font-size: 14px;
  letter-spacing: 0.1px;
  color: #696974;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-left: ${(props: IScoreProps) => !props.option && '10px'};
`
const ScoreLineDivElement = styled.div`
  background-color: #e2e2ea;
  width: 100%;
  height: 3px;
  border-radius: 2.5px;
  min-width: ${(props: IScoreProps) => !props.option && '150px'};
  div {
    height: 3px;
    background-color: #3dd598;
    width: ${(props: IScoreProps) => `${props.scoreLine}%`};
  }
`
interface IScoreProps {
	scoreLine: number
  taskItem: ITaskState
  option: boolean
}

const Score: React.FC<IScoreProps> = props => {
  const { scoreLine, taskItem } = props
	const countDecimals= (num) => {
  	let text = num.toString()
  	if (text.indexOf('e-') > -1) {
    	let [base, trail] = text.split('e-')
    	let elen = parseInt(trail, 10)
    	let idx = base.indexOf(".")
    	return idx == -1 ? 0 + elen : (base.length - idx - 1) + elen
  	}
  	let index = text.indexOf(".")
  	return index == -1 ? 0 : (text.length - index - 1)
	}
  return (
    <Wrapper {...props}>
      <ScoreLineTitle {...props}>{countDecimals(scoreLine) > 2 ? scoreLine.toFixed(2) : scoreLine}%</ScoreLineTitle>
      <ScoreLineDivElement {...props}>
        <div />
      </ScoreLineDivElement>
    </Wrapper>
  )
}

interface IScoreWrapperProps {
	taskItem: ITaskState
	option: boolean
}
const ScoreWrapper: React.FC<IScoreWrapperProps> = props => {
	const { taskItem } = props
	  const handleComputeScoreLine = (taskItem: ITaskState) => {
    let scoreLine = 0
    if (taskItem.complete == true) {
      return 100
    } else {
      const subTaskListTotal = taskItem.subTaskList.length
      const subTaskListComplete = taskItem.subTaskList.filter(item => item.complete == true).length
      scoreLine = (subTaskListComplete / subTaskListTotal) * 100
      return scoreLine
    }
  }

  const scoreLine = handleComputeScoreLine(taskItem)
	
	return <Score { ...props } scoreLine={scoreLine} />
}
export default ScoreWrapper
