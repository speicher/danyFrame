package com.danyShop.utils;

import java.io.IOException;
import java.io.Writer;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateDirectiveModel;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

public class EnvironmentIdentifyMethod implements TemplateDirectiveModel {
	private static final String ENV_PARAM = "env";

	public void execute(Environment env, Map params, TemplateModel[] loopVars,
			TemplateDirectiveBody body) throws TemplateException, IOException {
		if ((params.isEmpty()) || (!params.containsKey("env"))) {
			throw new TemplateModelException("The param \"env\" is required.");
		}
		if (loopVars.length != 0) {
			throw new TemplateModelException(
					"This directive doesn't allow loop variables.");
		}
		String envValue = String.valueOf(params.get("env"));
		if (StringUtils.isNotBlank(envValue)) {
			String _envValue = System.getProperty("env");
			if (StringUtils.equals(envValue, _envValue)) {
				if (body != null) {
					body.render(new AppendIdentifyWriter(env.getOut()));
				} else
					throw new RuntimeException("missing body");
			}
		}
	}

	private static class AppendIdentifyWriter extends Writer {
		private final Writer out;

		AppendIdentifyWriter(Writer out) {
			this.out = out;
		}

		public void write(char[] cbuf, int off, int len) throws IOException {
			this.out.write(cbuf);
		}

		public void flush() throws IOException {
			this.out.flush();
		}

		public void close() throws IOException {
			this.out.close();
		}
	}
}