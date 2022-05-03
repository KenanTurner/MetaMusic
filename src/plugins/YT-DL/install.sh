echo "Installing youtube-dl.servce..."
DirName=$(pwd)
mkdir -p ~/.config/systemd/user/
cp ./youtube-dl.service ~/.config/systemd/user/youtube-dl.service
sed -i "s:dirname:$DirName:g" ~/.config/systemd/user/youtube-dl.service
systemctl --user daemon-reload
systemctl --user enable youtube-dl
systemctl --user start youtube-dl
echo "Done!"
