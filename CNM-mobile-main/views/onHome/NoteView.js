import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const NoteView = () => {
  const [liked, setLiked] = useState(false);
  const toggleLike = () => {
    setLiked(!liked);
  }
  return (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled
      >
        <View style={{ height: 100, marginBottom: 10 }}>
          <View style={{ flexDirection: "column", margin: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Image
                source={require("../onHome/image_view/image_avt.jpg")}
                style={{ height: 50, width: 50, borderRadius: "50%" }}
                resizeMode='cover'
              ></Image>
              <TouchableOpacity
                style={{ height: 40, width: 320, borderWidth: 0, backgroundColor: "white", justifyContent: "flex-start", }}
              >
                <Text style={{ fontSize: 16, color: "#a8aaac", marginTop: 8 }}>Hôm nay bạn thế nào? </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10 }}>

              <TouchableOpacity style={{ height: 25, width: 75, borderRadius: 20, backgroundColor: "#333", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="image" size={24} color="green" />
                  <Text>Ảnh</Text>
                </View>

              </TouchableOpacity>
              <TouchableOpacity style={{ height: 20, width: 75, borderRadius: 20, backgroundColor: "#f7f7f7" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome name="video-camera" size={24} color="pink" />
                  <Text>Video</Text>
                </View>

              </TouchableOpacity>
              <TouchableOpacity style={{ height: 20, width: 75, borderRadius: 20, backgroundColor: "#f7f7f7" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons name="image-multiple" size={24} color="blue" />
                  <Text>Album</Text>
                </View>

              </TouchableOpacity>


              <TouchableOpacity style={{ height: 20, width: 75, borderRadius: 20, backgroundColor: "#f7f7f7" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons name="timeline-clock" size={24} color="orange" />
                  <Text>Kỷ niệm</Text>
                </View>

              </TouchableOpacity>

            </View>
          </View>
        </View>
        <View style={{ height: 200 }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>Khoảng khắc</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity

              >
                <View style={{ height: 150, width: 90, borderRadius: 10, overflow: 'hidden' }}>
                  <Image
                    source={require("../onHome/image_view/image_avt.jpg")}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                    resizeMode='cover'
                  />
                  <View style={{ position: 'absolute', bottom: '10%', left: '35%', alignItems: 'center' }}>
                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="add-circle" size={24} color="black" />
                    </View>
                    <Text style={{ color: 'black', fontSize: 12, marginTop: 5 }}>Bạn</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity

              >
                <View style={{ height: 150, width: 90, borderRadius: 10, overflow: 'hidden' }}>
                  <Image
                    source={require("../onHome/image_view/image_avt.jpg")}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                    resizeMode='cover'
                  />
                  <View style={{ position: 'absolute', bottom: '10%', left: '35%', alignItems: 'center' }}>
                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="add-circle" size={24} color="black" />
                    </View>
                    <Text style={{ color: 'black', fontSize: 12, marginTop: 5 }}>Xinh Tú</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity

              >
                <View style={{ height: 150, width: 90, borderRadius: 10, overflow: 'hidden' }}>
                  <Image
                    source={require("../onHome/image_view/image_avt.jpg")}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                    resizeMode='cover'
                  />
                  <View style={{ position: 'absolute', bottom: '10%', left: '35%', alignItems: 'center' }}>
                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="add-circle" size={24} color="black" />
                    </View>
                    <Text style={{ color: 'black', fontSize: 12, marginTop: 5 }}>Văn Quý</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity

              >
                <View style={{ height: 150, width: 90, borderRadius: 10, overflow: 'hidden' }}>
                  <Image
                    source={require("../onHome/image_view/image_avt.jpg")}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                    resizeMode='cover'
                  />
                  <View style={{ position: 'absolute', bottom: '10%', left: '35%', alignItems: 'center' }}>
                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="add-circle" size={24} color="black" />
                    </View>
                    <Text style={{ color: 'black', fontSize: 12, marginTop: 5 }}>Tuấn Kiệt</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </View>
        {/* cần flatlist */}
        <View style={{ height: 500, backgroundColor: "#f5f5f5" }}>

        {/* chứa avatar và tên người dùng */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View style={{ flexDirection: "column" }}>
                <Image
                  source={require("../onHome/image_view/shiba_avt.jpg")}
                  style={{ height: 40, width: 40, borderRadius: "50%" }}
                  resizeMode='cover'
                ></Image>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text>Phan Thị Tú Xinh</Text>
                <Text>Hôm nay lúc 6.19</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="settings-helper" size={24} color="black" />
            </View>
          </View>
          {/* chứa caption, hastag */}
          <View style={{ height: 50, justifyContent: 'flex-start', margin: 10 }}>
            <Text>Tết</Text>
          </View>
          {/* chứa ảnh, video */}
          <View style={{ flexDirection: "column" }}>
            <Image
              source={require("../onHome/image_view/baidang_01.jpg")}
              style={{ height: 300, width: 400 }}
              resizeMode='cover'
            ></Image>
          </View>
          {/* chứa số lượt thích, bình luận */}
          <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", margin: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign name="heart" size={24} color="#ec262c" />
              <Text style={{ fontSize: 12, color: "#6f7073" }}> 4 người khác</Text>
            </View>
            {/* nút thích , text bình luận */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>

              <Text style={{ fontSize: 12, color: "#6f7073" }}> 4 bình luận</Text>
            </View>

          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              style={{ height: 30, width: 83, borderRadius: 20, backgroundColor: "#f7f7f7", justifyContent: "center", alignItems: "center", margin: 10 }}
              onPress={toggleLike}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign name="heart" size={24} color={liked ? "#ec262c" : "#6f7073"} />
                <Text style={{ fontSize: 14, color: "#6f7073" }}> Thích</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              placeholder='Nhập bình luận'
              style={{ height: 30, width: 350, borderRadius: 20, backgroundColor: "#f7f7f7", justifyContent: "center", alignItems: "center", margin: 10, paddingLeft: 10 }}

            ></TextInput>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default NoteView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
})
