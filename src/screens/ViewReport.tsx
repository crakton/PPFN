import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, Text } from 'react-native'

function ViewReport(props) {
	return (
		<SafeAreaView>
			<Text>View Appointment</Text>
		</SafeAreaView>
	)
}

ViewReport.propTypes = {}

export default memo(ViewReport)
