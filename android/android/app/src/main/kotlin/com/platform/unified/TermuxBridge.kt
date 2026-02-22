package com.platform.unified

import android.content.Context
import java.io.File

class TermuxBridge(private val context: Context) {

    fun startService(serviceName: String) {
        // Execute shell script via Runtime.getRuntime().exec in Termux env
        try {
            val script = File(context.filesDir, "unified-android-platform/services/scripts/start-\$serviceName.sh")
            if (script.exists()) {
                Runtime.getRuntime().exec(arrayOf("bash", script.absolutePath))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun stopService(serviceName: String) {
        // Execute corresponding stop script or kill logic
        try {
            val script = File(context.filesDir, "unified-android-platform/services/scripts/stop-\$serviceName.sh")
            if (script.exists()) {
                Runtime.getRuntime().exec(arrayOf("bash", script.absolutePath))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
