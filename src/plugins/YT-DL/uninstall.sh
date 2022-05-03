echo "Uninstalling youtube-dl.servce..."
DirName=$(pwd)
systemctl --user stop youtube-dl
systemctl --user disable youtube-dl
systemctl --user daemon-reload
rm ~/.config/systemd/user/youtube-dl.service
echo "Done!"
