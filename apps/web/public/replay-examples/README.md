# Blender replay examples

These files are byte-for-byte copies of the original prototype renders at repository commit `f6434e1557757b0862e25afb971af8f365f6c61d`, under `bus-service-dashboard-kuma/dist/animations/`. The `kuma` branch remains the source reference for the Blender scenes, builder, snapshot data, and scene verification.

Both silent H.264 videos are 1100 × 700 pixels and 10 seconds long. Each depicts both directions of one service on 7 October 2026, covering 06:00–12:00 Singapore time. PNG files are the original preview posters.

The app presents these as fixed synthetic examples with separate video controls. They are not generated from the current database, synchronized to the replay cursor, or recomputed for planning assumptions. The matching service/date does not establish current data parity. Movement between recorded stops is estimated on schematic routes.

No Blender source, prototype application code, or generated replay dataset is imported into the application. To inspect or regenerate the original scenes, use the files on `kuma`. Copying these media files does not change that branch.

Verify the media with `ffprobe -v error -show_streams -show_format <file.mp4>`. Compare the original blob using `git show f6434e1:bus-service-dashboard-kuma/dist/animations/<filename>`.
