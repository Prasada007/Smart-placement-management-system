# Build stage
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Run stage
FROM tomcat:10.1-jdk17-temurin
WORKDIR /usr/local/tomcat
RUN rm -rf webapps/*
COPY --from=build /app/target/*.war webapps/ROOT.war
EXPOSE 8080

# Configure memory limits for Render's 512MB RAM environment
ENV CATALINA_OPTS="-Xmx350m -XX:MaxRAMPercentage=75.0"

CMD ["catalina.sh", "run"]
