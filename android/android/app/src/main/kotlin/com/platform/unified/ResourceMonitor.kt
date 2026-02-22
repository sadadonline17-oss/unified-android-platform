package com.platform.unified

import android.app.ActivityManager
import android.content.Context

object ResourceMonitor {
    fun getRamUsage(): Double {
        // Mocked implementation for Termux/Android bridge
        // In reality, this would read /proc/meminfo or use ActivityManager
        return 2.1
    }

    fun getCpuUsage(): Double {
        return 15.0
    }
}
