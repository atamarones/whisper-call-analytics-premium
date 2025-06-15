
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Smile,
  Target,
  Shield
} from 'lucide-react';

interface ConversationAnalysisDashboardProps {
  conversationId?: string;
}

const ConversationAnalysisDashboard = ({ conversationId }: ConversationAnalysisDashboardProps) => {
  const { data: analysisData, isLoading } = useConversationAnalysis(conversationId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const analysis = analysisData?.[0]; // Tomar el análisis más reciente

  if (!analysis) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay análisis disponible para esta conversación
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Análisis de Conversación</h1>
          <p className="text-muted-foreground">Análisis detallado de calidad y rendimiento</p>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción General</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.overall_satisfaction_score ? `${(analysis.overall_satisfaction_score * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <Progress 
              value={analysis.overall_satisfaction_score ? analysis.overall_satisfaction_score * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calidad de Conversación</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.conversation_quality_score ? `${(analysis.conversation_quality_score * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <Progress 
              value={analysis.conversation_quality_score ? analysis.conversation_quality_score * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logro de Objetivos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.goal_achievement_score ? `${(analysis.goal_achievement_score * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <Progress 
              value={analysis.goal_achievement_score ? analysis.goal_achievement_score * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.compliance_score ? `${(analysis.compliance_score * 100).toFixed(1)}%` : 'N/A'}
            </div>
            <Progress 
              value={analysis.compliance_score ? analysis.compliance_score * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Métricas operacionales */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métricas Operacionales</CardTitle>
            <CardDescription>Indicadores de rendimiento de la conversación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Interrupciones</span>
              <Badge variant={analysis.interruption_count && analysis.interruption_count > 5 ? "destructive" : "secondary"}>
                {analysis.interruption_count || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tiempo de silencio</span>
              <Badge variant="outline">
                {analysis.dead_air_duration_seconds || 0}s
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversión lograda</span>
              {analysis.conversion_achieved ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seguimiento requerido</span>
              {analysis.follow_up_required ? (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              ) : (
                <span className="text-sm text-muted-foreground">No</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Sentimientos</CardTitle>
            <CardDescription>Distribución emocional de la conversación</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.sentiment_analysis ? (
              <div className="space-y-3">
                {Object.entries(analysis.sentiment_analysis as Record<string, number>).map(([sentiment, value]) => (
                  <div key={sentiment} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{sentiment}</span>
                      <span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay análisis de sentimientos disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen y temas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Conversación</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.conversation_summary ? (
              <p className="text-sm leading-relaxed">{analysis.conversation_summary}</p>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay resumen disponible
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temas Discutidos</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.topics_discussed ? (
              <div className="flex flex-wrap gap-2">
                {(analysis.topics_discussed as string[]).map((topic, index) => (
                  <Badge key={index} variant="outline">{topic}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay temas identificados
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Elementos de acción */}
      {analysis.action_items && (
        <Card>
          <CardHeader>
            <CardTitle>Elementos de Acción</CardTitle>
            <CardDescription>Tareas y seguimientos identificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(analysis.action_items as string[]).map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Tipo de Análisis</p>
              <p className="text-sm text-muted-foreground">{analysis.analysis_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Analizado por</p>
              <p className="text-sm text-muted-foreground">{analysis.analyzed_by || 'Sistema automático'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Confianza del Análisis</p>
              <p className="text-sm text-muted-foreground">
                {analysis.analysis_confidence ? `${(analysis.analysis_confidence * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationAnalysisDashboard;
