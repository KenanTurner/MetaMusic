echo "Installing youtube-dl.servce..."
DirName=$(pwd)
mkdir -p ~/.config/systemd/user/
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o $DirName/yt-dlp.zip
unzip -qo yt-dlp.zip -d $DirName/yt-dlp
cp ./daemon.py $DirName/yt-dlp/
cp ./youtube-dl.service ~/.config/systemd/user/youtube-dl.service
sed -i "s:dirname:$DirName:g" ~/.config/systemd/user/youtube-dl.service
systemctl --user daemon-reload
systemctl --user enable youtube-dl
systemctl --user start youtube-dl
echo "Done!"
