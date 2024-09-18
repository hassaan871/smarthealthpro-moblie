# End-to-end-Medical-Chatbot--front-end-react-native



<View style={styles.headerContainer}>
<Ionicons
  name="arrow-back"
  size={24}
  color="white"
  onPress={() => navigation.goBack()}
  style={styles.backIcon}
/>
<View style={styles.profileImageContainer}>
  {/* Placeholder for the profile image */}
  <View style={styles.profileImage} />
</View>
<View style={styles.headerTextContainer}>
  <Text style={styles.headerName}>ChatBot</Text>
  <Text style={styles.headerSubtext}>Online</Text>
</View>
</View>

{loading ? (
<ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
) : (
<ScrollView
  ref={scrollViewRef}
  onContentSizeChange={() =>
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }
>
  {messages.map((item, index) => (
    <Pressable
      key={index}
      style={[
        styles.message,
        item?.author === patientId
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text
        style={
          item?.author === patientId
            ? styles.messageContent
            : styles.receivedMessageContent
        }
      >
        {formatTextWithBold(item?.text)}
      </Text>
      <Text style={styles.messageTime}>
        {formatTime(item?.createdAt)}
      </Text>
    </Pressable>
  ))}
</ScrollView>
)}

<View style={styles.inputContainer}>
<Entypo name="emoji-happy" size={24} color="gray" />
<TextInput
  aria-disabled={conversationEnd ? true : false}
  placeholder="Type your message..."
  placeholderTextColor="#aaaaaa"
  value={message}
  onChangeText={setMessage}
  style={styles.textInput}
/>
<View style={styles.iconContainer}>
  <Entypo
    name="camera"
    size={24}
    color="gray"
    onPress={handleFileSelection}
  />
  <Feather name="mic" size={24} color="gray" />
</View>
<Pressable style={styles.sendButton} onPress={handleSendPress}>
  <Text style={styles.sendButtonText}>Send</Text>
</Pressable>
</View>