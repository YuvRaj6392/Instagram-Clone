export const initialState = null
export const reducer=(state,action)=>{
    if(action.type==="USER")
    {
        return action.payload
    }
    if(action.type==="CLEAR")
    {
        return null
    }
    if(action.type==="UPDATE")
    {
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        }
    }
    if(action.type==="UPDATEPIC")
    {
        return {
            ...state,
            pic:action.payload
        }
    }
    return state
}
//action describes the intention of the work(what you need to do)
//dispatch acts as a medium and sends action to the reducer
//reducer determines the change. Return the new state and tells the store what to do
//line number 9- state will become null!1