DirName=$(pwd)
systemctl --user stop youtube-dl
systemctl --user disable youtube-dl
systemctl --user daemon-reload
rm -r $DirName/yt-dlp
rm -r $DirName/yt-dlp.zip
rm ~/.config/systemd/user/youtube-dl.service
