

interface Hello{
  hello:string
}

function App() {
  let count1: number | string | Hello;

  count1 = "Hello world ";

  count1 = {
    hello: "hello"
  }
  let hello:string=count1.hello

  let statement: undefined

  statement = undefined

  let arrays: (number | string | boolean | number[])[] = [2, 3, 4, 5, 5, "my name is arun", true]
  arrays.push(993, "hello", [3, 4])
  const x=arrays.pop()

  let var_name: string | number | boolean | number[] = arrays.pop()

  const objects: {
    name: boolean,
    age: number
  } = {
    name: true,
    age: 23
  }

  const name=objects.name

  let count2 = 20;

  const function_name=(a:number,b:number):number=>{
    return a+b;
  }
  const output=function_name(23,45)
  console.log(output)

  let array:[string,number,boolean]=['Hello',123,true]
  console.log(array)

  let user_id:any;

  user_id='jwdb'
  user_id=[123,"kjdf",true]

  const function_name1=(value:number,value2:string):any=>{
    return `hello ${value} meet my frined ${value2}`
  }

  const var1=function_name1(123,"gegu")
  console.log(var1)

  const func3=():[number,number]=>{
    const num1=1;
    const num2=2;

    return [num1,num2]
  }

  const [num1,num2]:[number,number]=func3()
  console.log(num1,num2)

  interface Author{
    name:string,
    image:string,
    details:{
      address:{
        street:string,
        state:string,
        code:number
      },
      socials:{
        fun:{(key:string):string}
      }
    }
  }

  interface Post{
    title:string,
    body:string,
    point:string,
    author:Author
  }

  const newPost:Post={
    title:'Title of the post',
    body:'Body of the post',
    point:'Actual point mentioned',
    author:{
      name:'x',
      image:'/image/image.png',
      details:{
        address:{
          street:'abc',
          state:'xyz',
          code:12345
        },
        socials:{
          fun:(x)=>{
            return x
          }
        }
      }

    }
  }

  console.log(`The new post is been relased by ${newPost.author.name} stating ${newPost.body} ${newPost.author.details.socials.fun('ueh')}`)
  return (
    <>
      {typeof count1 ==='object' && count1.hello}
      {count2}
      {statement}
      {arrays}
      {var_name}
      {name}
    </>
  )
}

export default App
