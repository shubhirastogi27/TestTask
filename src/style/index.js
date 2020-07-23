import {StyleSheet} from 'react-native'

export const styling= StyleSheet.create({
    tabs : {
        borderRadius: 3,
        borderColor: 'gray',
        shadowColor: "gray",
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1
        },
        elevation: 7,
        borderWidth:1,
        backgroundColor:"white",
        alignContent:"center",
        marginHorizontal:"2%",
        padding:"1%"
       
    },
    container: {
        flex: 1,
        width: "100%",
        height: "80%",
        justifyContent: "center",
        alignItems: "center",
      }
})