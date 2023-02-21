function functions_deploy() {

    # 標準入力（キーボード）から1行受け取って変数strにセット
    #
    echo "Target No ----------"
    echo "1. helloWorld"
    echo "2. helloWorldSecureOnRequest"
    echo "3. helloWorldSecureOnCall"
    echo "4. createRtcIdTokenOnRequest"
    echo "5. createRtcIdToken"
    echo ""

    read -p "Target No? > " str	

    # 変数strの内容で分岐
    case "$str" in			
      1)
        targetName="helloWorld"
        ;;
      2)
        targetName="helloWorldSecureOnRequest"
        ;;
      3)
        targetName="helloWorldSecureOnCall"
        ;;
      4)
        targetName="createRtcIdTokenOnRequest"
        ;;
      5)
        targetName="createRtcIdToken"
        ;;
      *)
        echo "undefined"
        exit
        ;;
    esac
    
    firebase deploy --only functions:$targetName

}

functions_deploy
